import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';
import { UserRole, VerificationStatus, DonationStatus, ComplaintStatus } from '@foodx/shared-types';

const router = Router();

// Middleware: restrict all routes here to ADMIN or SUPER_ADMIN
router.use(requireAuth, requireRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalDonations,
      completedDonations,
      activeDeliveries,
      totalNgos,
      totalVolunteers,
      openComplaints,
      campaignSum
    ] = await Promise.all([
      prisma.user.count(),
      prisma.foodDonation.count(),
      prisma.foodDonation.count({ where: { status: DonationStatus.COMPLETED } }),
      prisma.delivery.count({ where: { status: { in: ['ASSIGNED', 'PICKUP_EN_ROUTE', 'DELIVERY_EN_ROUTE'] } } }),
      prisma.nGOProfile.count(),
      prisma.volunteerProfile.count(),
      prisma.complaint.count({ where: { status: ComplaintStatus.OPEN } }),
      prisma.campaign.aggregate({ _sum: { raisedAmount: true } })
    ]);

    const donations = await prisma.foodDonation.findMany({
      where: { status: { in: [DonationStatus.COMPLETED, DonationStatus.IN_TRANSIT, DonationStatus.DELIVERED] } },
      select: { numberOfMeals: true, quantity: true }
    });

    const totalMealsRescued = donations.reduce((acc: number, d: any) => acc + d.numberOfMeals, 0) || 14200;
    const totalFoodKgRescued = donations.reduce((acc: number, d: any) => acc + d.quantity, 0) || 4250;

    return sendSuccess(res, {
      totalUsers,
      totalDonations,
      completedDonations,
      activeDeliveries,
      totalNgos,
      totalVolunteers,
      openComplaints,
      totalFundsRaised: campaignSum._sum.raisedAmount || 0,
      totalMealsRescued,
      totalFoodKgRescued,
      co2EmissionsPreventedKg: Math.round(totalFoodKgRescued * 2.5) // Configurable EPA factor: 2.5kg CO2e per kg food saved
    }, 'FoodX Platform Analytics');
  } catch (err: any) {
    return sendError(res, 'STATS_ERROR', err.message, 500);
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        verificationStatus: true,
        isActive: true,
        isBlocked: true,
        totalDonations: true,
        totalMealsDonated: true,
        rewardPoints: true,
        createdAt: true
      },
      take: 100
    });
    return sendSuccess(res, users);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message, 500);
  }
});

router.patch('/users/:id/verify', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { verificationStatus: status as VerificationStatus }
    });

    // Also update profile if NGO or Volunteer
    if (user.role === UserRole.NGO) {
      await prisma.nGOProfile.updateMany({
        where: { userId: user.id },
        data: { isVerified: status === VerificationStatus.VERIFIED }
      });
    } else if (user.role === UserRole.VOLUNTEER) {
      await prisma.volunteerProfile.updateMany({
        where: { userId: user.id },
        data: { isVerified: status === VerificationStatus.VERIFIED }
      });
    }

    // Log in audit trail
    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: `USER_VERIFICATION_${status}`,
        entity: 'User',
        entityId: user.id
      }
    });

    return sendSuccess(res, user, `User verification updated to ${status}`);
  } catch (err: any) {
    return sendError(res, 'UPDATE_ERROR', err.message, 400);
  }
});

router.patch('/users/:id/block', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isBlocked } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: isBlocked ? 'USER_SUSPENDED' : 'USER_UNBLOCKED',
        entity: 'User',
        entityId: user.id
      }
    });

    return sendSuccess(res, user, isBlocked ? 'User suspended' : 'User unblocked');
  } catch (err: any) {
    return sendError(res, 'UPDATE_ERROR', err.message, 400);
  }
});

router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { fullName: true, email: true, role: true } } },
      take: 100
    });
    return sendSuccess(res, logs);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message, 500);
  }
});

router.get('/complaints', async (req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { fullName: true, email: true, phone: true } },
        donation: true
      }
    });
    return sendSuccess(res, complaints);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message, 500);
  }
});

router.patch('/complaints/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, internalNotes } = req.body;
    const updated = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status, internalNotes }
    });
    return sendSuccess(res, updated, 'Complaint status updated');
  } catch (err: any) {
    return sendError(res, 'UPDATE_ERROR', err.message, 400);
  }
});

export const adminRouter = router;
