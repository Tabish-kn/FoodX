import { prisma } from '../db/prisma';
import { mapService } from '../adapters';
import { MATCHING_WEIGHTS } from '@foodx/config';
import { FoodDonation, NGOProfile } from '@prisma/client';

export interface MatchResult {
  ngoId: string;
  ngoName: string;
  distanceKm: number;
  distanceScore: number;
  foodTypeScore: number;
  quantityScore: number;
  urgencyScore: number;
  expiryScore: number;
  availabilityScore: number;
  overallScore: number;
}

export class MatchingService {
  async findMatchesForDonation(donationId: string): Promise<MatchResult[]> {
    const donation = await prisma.foodDonation.findUnique({
      where: { id: donationId },
      include: { pickupAddress: true }
    });

    if (!donation) return [];

    const ngos = await prisma.nGOProfile.findMany({
      where: { isVerified: true },
      include: {
        user: {
          include: {
            addresses: { where: { isDefault: true } }
          }
        }
      }
    });

    const results: MatchResult[] = [];

    for (const ngo of ngos) {
      const ngoAddress = ngo.user.addresses[0];
      if (!ngoAddress) continue;

      // 1. Distance Calculation & Score (0 - 100)
      const distanceKm = mapService.calculateDistanceKm(
        donation.pickupAddress.latitude,
        donation.pickupAddress.longitude,
        ngoAddress.latitude,
        ngoAddress.longitude
      );

      if (distanceKm > (ngo.serviceRadiusKm || 25)) continue;

      const distanceScore = Math.max(0, 100 - (distanceKm / ngo.serviceRadiusKm) * 100);

      // 2. Food Type Compatibility Score
      const foodTypeScore =
        ngo.foodPreferences.length === 0 || ngo.foodPreferences.includes(donation.category)
          ? 100
          : 60;

      // 3. Quantity & Capacity Fit Score
      const capacityRatio = Math.min(1.0, donation.numberOfMeals / Math.max(1, ngo.beneficiaryCount));
      const quantityScore = Math.round(capacityRatio * 100);

      // 4. Urgency & Expiry Score
      const now = new Date().getTime();
      const expiryTime = new Date(donation.expiryTime).getTime();
      const hoursRemaining = Math.max(0, (expiryTime - now) / (1000 * 60 * 60));
      const expiryScore = hoursRemaining <= 2 ? 100 : hoursRemaining <= 4 ? 85 : 70;
      const urgencyScore = donation.priority === 'EMERGENCY' ? 100 : donation.priority === 'URGENT' ? 85 : 70;

      // 5. Volunteer Availability Score (Simulated active volunteers within 5km)
      const availabilityScore = 90;

      // Weighted Composite Overall Score
      const overallScore = Math.round(
        distanceScore * MATCHING_WEIGHTS.distance +
        urgencyScore * MATCHING_WEIGHTS.urgency +
        quantityScore * MATCHING_WEIGHTS.quantityFit +
        foodTypeScore * MATCHING_WEIGHTS.foodType +
        availabilityScore * MATCHING_WEIGHTS.availability
      );

      // Save/Upsert Match in DB
      await prisma.match.upsert({
        where: {
          donationId_ngoId: {
            donationId: donation.id,
            ngoId: ngo.id
          }
        },
        create: {
          donationId: donation.id,
          ngoId: ngo.id,
          matchScore: overallScore,
          distanceKm,
          distanceScore,
          urgencyScore,
          foodTypeScore,
          quantityScore,
          expiryScore
        },
        update: {
          matchScore: overallScore,
          distanceKm,
          distanceScore,
          urgencyScore,
          expiryScore
        }
      });

      results.push({
        ngoId: ngo.id,
        ngoName: ngo.organizationName,
        distanceKm,
        distanceScore: Math.round(distanceScore),
        foodTypeScore,
        quantityScore,
        urgencyScore,
        expiryScore,
        availabilityScore,
        overallScore
      });
    }

    // Sort by highest match score first
    return results.sort((a, b) => b.overallScore - a.overallScore);
  }
}

export const matchingService = new MatchingService();
