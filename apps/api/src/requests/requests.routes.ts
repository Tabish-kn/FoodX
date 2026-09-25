import { Router, Request, Response } from 'express';
import { requestsService } from './requests.service';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';
import { CreateFoodRequestSchema } from '@foodx/validation';

const router = Router();

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = CreateFoodRequestSchema.parse(req.body);
    const request = await requestsService.createRequest(req.user!.id, validated);
    return sendSuccess(res, request, 'Food request created', 201);
  } catch (err: any) {
    return sendError(res, 'VALIDATION_ERROR', err.message || 'Failed to create food request', 400);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { priority, isFulfilled } = req.query;
    const requests = await requestsService.listRequests({
      priority: priority as any,
      isFulfilled: isFulfilled === 'true' ? true : isFulfilled === 'false' ? false : undefined
    });
    return sendSuccess(res, requests);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message || 'Failed to fetch food requests', 500);
  }
});

export const requestsRouter = router;
