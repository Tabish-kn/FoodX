import { prisma } from '../db/prisma';
import { CreateFoodRequestInput } from '@foodx/validation';
import { PriorityLevel, NotificationType, UserRole } from '@foodx/shared-types';

export class RequestsService {
  async createRequest(requesterId: string, input: CreateFoodRequestInput) {
    const request = await prisma.foodRequest.create({
      data: {
        requesterId,
        title: input.title,
        description: input.description,
        category: input.category as any,
        mealsRequired: input.mealsRequired,
        dietaryRequirements: input.dietaryRequirements as any[],
        targetLatitude: input.targetLocation.latitude,
        targetLongitude: input.targetLocation.longitude,
        targetAddress: `${input.targetLocation.street}, ${input.targetLocation.city}`,
        requiredBy: new Date(input.requiredBy),
        priority: input.priority,
        numberOfPeople: input.numberOfPeople
      },
      include: {
        requester: { select: { fullName: true, role: true, phone: true } }
      }
    });

    // If priority is EMERGENCY, notify all nearby donors and NGOs
    if (input.priority === PriorityLevel.EMERGENCY) {
      const allActiveUsers = await prisma.user.findMany({
        where: {
          role: { in: [UserRole.DONOR, UserRole.RESTAURANT, UserRole.HOTEL, UserRole.NGO] },
          isActive: true
        },
        take: 50
      });

      await prisma.notification.createMany({
        data: allActiveUsers.map((u: { id: string }) => ({
          userId: u.id,
          type: NotificationType.EMERGENCY_REQUEST,
          title: '🚨 EMERGENCY FOOD AID NEEDED',
          message: `${input.title} requires ${input.mealsRequired} meals urgently at ${input.targetLocation.city}.`
        }))
      });
    }

    return request;
  }

  async listRequests(query: { priority?: PriorityLevel; isFulfilled?: boolean }) {
    const where: any = {};
    if (query.priority) where.priority = query.priority;
    if (query.isFulfilled !== undefined) where.isFulfilled = query.isFulfilled;

    return prisma.foodRequest.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        requester: { select: { fullName: true, role: true, phone: true } }
      }
    });
  }
}

export const requestsService = new RequestsService();
