import { prisma } from '../db/prisma';

export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        donorProfile: true,
        ngoProfile: true,
        volunteerProfile: true,
        beneficiaryProfile: true,
        userBadges: true,
        certificates: true
      }
    });

    if (!user) {
      throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    const { passwordHash, twoFactorSecret, ...sanitized } = user;
    return sanitized;
  }

  async updateProfile(userId: string, data: { fullName?: string; phone?: string; profilePhoto?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        profilePhoto: true,
        role: true,
        verificationStatus: true,
        rewardPoints: true,
        rating: true
      }
    });
  }

  async addAddress(userId: string, addressData: any) {
    if (addressData.isDefault) {
      // Unset previous default
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    return prisma.address.create({
      data: {
        userId,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country || 'India',
        postalCode: addressData.postalCode,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        isDefault: addressData.isDefault ?? true,
        label: addressData.label || 'Main Address'
      }
    });
  }

  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
  }
}

export const usersService = new UsersService();
