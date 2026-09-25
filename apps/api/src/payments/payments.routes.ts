import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { paymentService } from '../adapters';
import { sendSuccess, sendError } from '../common/response';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';
import { PaymentStatus } from '@foodx/shared-types';

const router = Router();

router.get('/campaigns', async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, campaigns);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message, 500);
  }
});

router.post('/checkout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { campaignId, amount, currency = 'INR' } = req.body;
    if (!amount || amount <= 0) return sendError(res, 'INVALID_AMOUNT', 'Amount must be > 0', 400);

    const session = await paymentService.createCheckoutSession(amount, currency, {
      userId: req.user!.id,
      campaignId
    });

    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        campaignId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        provider: 'STRIPE_OR_MOCK',
        transactionRef: session.sessionId
      }
    });

    return sendSuccess(res, { session, payment }, 'Payment checkout initiated', 201);
  } catch (err: any) {
    return sendError(res, 'CHECKOUT_ERROR', err.message, 400);
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { transactionRef, status = PaymentStatus.SUCCESS } = req.body;
    if (transactionRef) {
      const payment = await prisma.payment.findUnique({
        where: { transactionRef }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: status as any }
        });

        if (payment.campaignId && status === PaymentStatus.SUCCESS) {
          await prisma.campaign.update({
            where: { id: payment.campaignId },
            data: {
              raisedAmount: { increment: payment.amount },
              donorCount: { increment: 1 }
            }
          });
        }
      }
    }
    return sendSuccess(res, { received: true });
  } catch (err: any) {
    return sendError(res, 'WEBHOOK_ERROR', err.message, 400);
  }
});

export const paymentsRouter = router;
