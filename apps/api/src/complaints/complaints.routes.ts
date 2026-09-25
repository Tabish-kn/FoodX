import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';
import { CreateComplaintSchema } from '@foodx/validation';
import { ComplaintStatus } from '@foodx/shared-types';

const router = Router();

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = CreateComplaintSchema.parse(req.body);
    const complaint = await prisma.complaint.create({
      data: {
        authorId: req.user!.id,
        category: validated.category,
        description: validated.description,
        relatedDonationId: validated.relatedDonationId,
        attachments: validated.attachments,
        status: ComplaintStatus.OPEN
      }
    });
    return sendSuccess(res, complaint, 'Complaint filed and under investigation', 201);
  } catch (err: any) {
    return sendError(res, 'VALIDATION_ERROR', err.message, 400);
  }
});

router.get('/my', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { authorId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, complaints);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message, 500);
  }
});

export const complaintsRouter = router;
