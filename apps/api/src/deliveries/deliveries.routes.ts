import { Router, Response } from 'express';
import { deliveriesService } from './deliveries.service';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';
import { VerifyPickupSchema, VerifyDeliverySchema } from '@foodx/validation';
import { UserRole } from '@foodx/shared-types';

const router = Router();

router.get('/available', requireAuth, requireRoles(UserRole.VOLUNTEER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await deliveriesService.getAvailableTasks();
    return sendSuccess(res, tasks, 'Available volunteer delivery tasks');
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message || 'Failed to fetch tasks', 500);
  }
});

router.post('/:donationId/accept', requireAuth, requireRoles(UserRole.VOLUNTEER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const delivery = await deliveriesService.acceptTask(req.params.donationId, req.user!.id);
    return sendSuccess(res, delivery, 'Delivery task accepted by volunteer', 201);
  } catch (err: any) {
    return sendError(res, err.code || 'ACCEPT_ERROR', err.message || 'Failed to accept task', err.status || 400);
  }
});

router.post('/verify-pickup', requireAuth, requireRoles(UserRole.VOLUNTEER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = VerifyPickupSchema.parse(req.body);
    const result = await deliveriesService.verifyPickup(validated);
    return sendSuccess(res, result, 'Pickup successfully verified via QR & OTP');
  } catch (err: any) {
    return sendError(res, err.code || 'VERIFICATION_ERROR', err.message || 'Pickup verification failed', err.status || 400);
  }
});

router.post('/verify-delivery', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = VerifyDeliverySchema.parse(req.body);
    const result = await deliveriesService.verifyDelivery(validated);
    return sendSuccess(res, result, 'Delivery completed and verified successfully');
  } catch (err: any) {
    return sendError(res, err.code || 'VERIFICATION_ERROR', err.message || 'Delivery verification failed', err.status || 400);
  }
});

router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const delivery = await deliveriesService.getDeliveryById(req.params.id);
    if (!delivery) return sendError(res, 'NOT_FOUND', 'Delivery not found', 404);
    return sendSuccess(res, delivery);
  } catch (err: any) {
    return sendError(res, 'FETCH_ERROR', err.message || 'Failed to fetch delivery', 500);
  }
});

router.patch('/:id/location', requireAuth, requireRoles(UserRole.VOLUNTEER), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return sendError(res, 'INVALID_COORDINATES', 'Latitude and longitude required', 400);
    }
    const updated = await deliveriesService.updateLocation(req.params.id, latitude, longitude);
    return sendSuccess(res, updated);
  } catch (err: any) {
    return sendError(res, 'UPDATE_ERROR', err.message || 'Failed to update location', 400);
  }
});

export const deliveriesRouter = router;
