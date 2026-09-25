import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return sendSuccess(res, notifications);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message, 500);
  }
});

router.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: { isRead: true }
    });
    return sendSuccess(res, { updated: true });
  } catch (err: any) {
    return sendError(res, 'UPDATE_ERROR', err.message, 400);
  }
});

router.patch('/read-all', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true }
    });
    return sendSuccess(res, { allMarkedRead: true });
  } catch (err: any) {
    return sendError(res, 'UPDATE_ERROR', err.message, 400);
  }
});

export const notificationsRouter = router;
