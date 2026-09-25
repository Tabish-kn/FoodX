import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess, sendError } from '../common/response';
import { BADGE_DEFINITIONS } from '@foodx/config';

const router = Router();

router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const topUsers = await prisma.user.findMany({
      where: { isActive: true },
      take: 20,
      orderBy: { rewardPoints: 'desc' },
      select: {
        id: true,
        fullName: true,
        role: true,
        rewardPoints: true,
        totalDonations: true,
        totalMealsDonated: true,
        rating: true,
        userBadges: { select: { badgeType: true } }
      }
    });

    const leaderboard = topUsers.map((u: any, index: number) => ({
      rank: index + 1,
      userId: u.id,
      userName: u.fullName,
      role: u.role,
      points: u.rewardPoints,
      mealsCount: u.totalMealsDonated,
      rating: u.rating,
      badges: u.userBadges.map((b: any) => b.badgeType)
    }));

    return sendSuccess(res, leaderboard, 'FoodX Hero Leaderboard');
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message || 'Failed to load leaderboard', 500);
  }
});

router.get('/badges', (req: Request, res: Response) => {
  return sendSuccess(res, BADGE_DEFINITIONS, 'Available Badges & Criteria');
});

export const rewardsRouter = router;
