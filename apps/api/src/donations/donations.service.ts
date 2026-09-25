import { prisma } from '../db/prisma';
import { CreateDonationInput } from '@foodx/validation';
import { DonationStatus, PriorityLevel, NotificationType } from '@foodx/shared-types';
import { matchingService } from '../matching/matching.service';
import { EXPIRY_THRESHOLDS, GAMIFICATION_POINTS } from '@foodx/config';
import { notificationService } from '../adapters';

export class DonationsService {
  private calculatePriority(expiryTime: Date): PriorityLevel {
    const hoursLeft = (expiryTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursLeft <= EXPIRY_THRESHOLDS.EMERGENCY_HOURS || hoursLeft <= 1) return PriorityLevel.EMERGENCY;
    if (hoursLeft <= EXPIRY_THRESHOLDS.URGENT_HOURS || hoursLeft <= 3) return PriorityLevel.URGENT;
    if (hoursLeft <= EXPIRY_THRESHOLDS.HIGH_HOURS || hoursLeft <= 6) return PriorityLevel.HIGH;
    return PriorityLevel.NORMAL;
  }

  async createDonation(donorId: string, input: CreateDonationInput) {
    const expiryDate = new Date(input.expiryTime);
    const prepDate = new Date(input.preparationTime);
    const pickupStart = new Date(input.pickupStartTime);
    const pickupEnd = new Date(input.pickupEndTime);

    const calculatedPriority = this.calculatePriority(expiryDate);

    // 1. Create or resolve pickup address
    const address = await prisma.address.create({
      data: {
        userId: donorId,
        street: input.pickupAddress.street,
        city: input.pickupAddress.city,
        state: input.pickupAddress.state,
        country: input.pickupAddress.country || 'India',
        postalCode: input.pickupAddress.postalCode,
        latitude: input.pickupAddress.latitude,
        longitude: input.pickupAddress.longitude,
        label: 'Donation Pickup Point'
      }
    });

    // 2. Create Food Donation record
    const donation = await prisma.foodDonation.create({
      data: {
        donorId,
        title: input.title,
        description: input.description,
        category: input.category as any,
        quantity: input.quantity,
        unit: input.unit,
        numberOfMeals: input.numberOfMeals,
        dietaryFlags: input.dietaryFlags as any[],
        allergens: input.allergens,
        preparationTime: prepDate,
        expiryTime: expiryDate,
        storageCondition: input.storageCondition as any,
        pickupAddressId: address.id,
        pickupStartTime: pickupStart,
        pickupEndTime: pickupEnd,
        contactPerson: input.contactPerson,
        contactPhone: input.contactPhone,
        specialInstructions: input.specialInstructions,
        status: DonationStatus.PUBLISHED,
        priority: calculatedPriority,
        images: {
          create: (input.images || []).map((url: string) => ({ url }))
        }
      },
      include: {
        images: true,
        pickupAddress: true,
        donor: {
          select: { id: true, fullName: true, email: true, phone: true, role: true }
        }
      }
    });

    // 3. Generate QR Token & OTP Codes
    const pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const pickupToken = `QR-PK-${donation.id.substring(0, 8).toUpperCase()}`;
    const deliveryToken = `QR-DL-${donation.id.substring(0, 8).toUpperCase()}`;

    await prisma.qRToken.create({
      data: {
        donationId: donation.id,
        pickupToken,
        deliveryToken,
        expiresAt: expiryDate
      }
    });

    await prisma.oTPVerification.create({
      data: {
        donationId: donation.id,
        pickupOtp,
        deliveryOtp,
        expiresAt: expiryDate
      }
    });

    // 4. Update Donor Stats & Reward Points
    await prisma.user.update({
      where: { id: donorId },
      data: {
        totalDonations: { increment: 1 },
        totalMealsDonated: { increment: input.numberOfMeals },
        rewardPoints: { increment: GAMIFICATION_POINTS.DONATION_CREATED }
      }
    });

    // 5. Trigger Smart Matching in Background
    matchingService.findMatchesForDonation(donation.id).catch(console.error);

    // 6. In-app Notification to Donor
    await prisma.notification.create({
      data: {
        userId: donorId,
        type: NotificationType.DONATION_CREATED,
        title: 'Food Donation Published',
        message: `Your donation "${donation.title}" for ${donation.numberOfMeals} meals is now live and matching with nearby NGOs.`
      }
    });

    return donation;
  }

  async listDonations(query: {
    status?: DonationStatus;
    category?: string;
    priority?: PriorityLevel;
    donorId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;
    if (query.priority) where.priority = query.priority;
    if (query.donorId) where.donorId = query.donorId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.foodDonation.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          images: true,
          pickupAddress: true,
          donor: {
            select: { id: true, fullName: true, email: true, phone: true, role: true }
          },
          acceptedByNgo: true
        }
      }),
      prisma.foodDonation.count({ where })
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getDonationById(id: string) {
    const donation = await prisma.foodDonation.findUnique({
      where: { id },
      include: {
        images: true,
        pickupAddress: true,
        donor: { select: { id: true, fullName: true, email: true, phone: true, role: true } },
        acceptedByNgo: { include: { user: true } },
        delivery: { include: { volunteer: true } },
        qrToken: true,
        otpVerification: true,
        matches: { include: { ngo: true } }
      }
    });

    if (!donation) {
      throw { status: 404, code: 'DONATION_NOT_FOUND', message: 'Food donation listing not found' };
    }

    return donation;
  }

  async acceptDonation(donationId: string, ngoUserId: string) {
    const ngo = await prisma.nGOProfile.findUnique({
      where: { userId: ngoUserId },
      include: { user: { include: { addresses: true } } }
    });

    if (!ngo) {
      throw { status: 403, code: 'NOT_AN_NGO', message: 'Only registered NGOs can accept food donations' };
    }

    const donation = await prisma.foodDonation.findUnique({
      where: { id: donationId },
      include: { pickupAddress: true, donor: true }
    });

    if (!donation) {
      throw { status: 404, code: 'DONATION_NOT_FOUND', message: 'Donation not found' };
    }

    if (donation.status !== DonationStatus.PUBLISHED && donation.status !== DonationStatus.MATCHING) {
      throw { status: 400, code: 'INVALID_STATUS', message: `Donation is in ${donation.status} status and cannot be accepted` };
    }

    const ngoAddress = ngo.user.addresses[0] || {
      latitude: donation.pickupAddress.latitude + 0.02,
      longitude: donation.pickupAddress.longitude + 0.02,
      street: 'NGO Distribution Center, Main Road',
      city: 'Delhi'
    };

    // Update donation status
    const updated = await prisma.foodDonation.update({
      where: { id: donationId },
      data: {
        status: DonationStatus.ACCEPTED,
        acceptedByNgoId: ngo.id
      },
      include: { pickupAddress: true, donor: true }
    });

    // Notify Donor
    await prisma.notification.create({
      data: {
        userId: donation.donorId,
        type: NotificationType.DONATION_ACCEPTED,
        title: 'Donation Accepted!',
        message: `${ngo.organizationName} has accepted your donation "${donation.title}". A volunteer will be assigned shortly.`
      }
    });

    return updated;
  }

  async cancelDonation(donationId: string, donorId: string) {
    const donation = await prisma.foodDonation.findUnique({ where: { id: donationId } });
    if (!donation) throw { status: 404, code: 'NOT_FOUND', message: 'Donation not found' };
    if (donation.donorId !== donorId) throw { status: 403, code: 'UNAUTHORIZED', message: 'Not authorized to cancel this donation' };

    return prisma.foodDonation.update({
      where: { id: donationId },
      data: { status: DonationStatus.CANCELLED }
    });
  }
}

export const donationsService = new DonationsService();
