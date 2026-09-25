import { Router, Request, Response } from 'express';
import { donationsService } from './donations.service';
import { matchingService } from '../matching/matching.service';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';
import { CreateDonationSchema } from '@foodx/validation';
import { UserRole } from '@foodx/shared-types';

const router = Router();

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = CreateDonationSchema.parse(req.body);
    const donation = await donationsService.createDonation(req.user!.id, validated);
    return sendSuccess(res, donation, 'Food donation published successfully', 201);
  } catch (err: any) {
    return sendError(res, err.code || 'VALIDATION_ERROR', err.message || 'Failed to create donation', err.status || 400);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category, priority, donorId, search, page, limit } = req.query;
    const result = await donationsService.listDonations({
      status: status as any,
      category: category as any,
      priority: priority as any,
      donorId: donorId as any,
      search: search as any,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20
    });
    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message || 'Failed to list donations', 500);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const donation = await donationsService.getDonationById(req.params.id);
    return sendSuccess(res, donation);
  } catch (err: any) {
    return sendError(res, err.code || 'FETCH_ERROR', err.message || 'Failed to fetch donation', err.status || 404);
  }
});

router.get('/:id/matches', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const matches = await matchingService.findMatchesForDonation(req.params.id);
    return sendSuccess(res, matches, 'Calculated AI matching score results');
  } catch (err: any) {
    return sendError(res, 'MATCHING_ERROR', err.message || 'Failed to compute matches', 500);
  }
});

router.post('/:id/accept', requireAuth, requireRoles(UserRole.NGO), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const accepted = await donationsService.acceptDonation(req.params.id, req.user!.id);
    return sendSuccess(res, accepted, 'Donation successfully accepted by NGO');
  } catch (err: any) {
    return sendError(res, err.code || 'ACCEPT_ERROR', err.message || 'Failed to accept donation', err.status || 400);
  }
});

router.post('/:id/cancel', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const cancelled = await donationsService.cancelDonation(req.params.id, req.user!.id);
    return sendSuccess(res, cancelled, 'Donation cancelled');
  } catch (err: any) {
    return sendError(res, err.code || 'CANCEL_ERROR', err.message || 'Failed to cancel donation', err.status || 400);
  }
});

export const donationsRouter = router;
