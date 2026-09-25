import { Router, Response } from 'express';
import { usersService } from './users.service';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';
import { AddressSchema } from '@foodx/validation';

const router = Router();

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await usersService.getProfile(req.user!.id);
    return sendSuccess(res, profile);
  } catch (err: any) {
    return sendError(res, err.code || 'PROFILE_ERROR', err.message || 'Failed to fetch profile', err.status || 500);
  }
});

router.patch('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, phone, profilePhoto } = req.body;
    const updated = await usersService.updateProfile(req.user!.id, { fullName, phone, profilePhoto });
    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (err: any) {
    return sendError(res, err.code || 'UPDATE_ERROR', err.message || 'Failed to update profile', err.status || 400);
  }
});

router.get('/me/addresses', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const addresses = await usersService.getAddresses(req.user!.id);
  return sendSuccess(res, addresses);
});

router.post('/me/addresses', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = AddressSchema.parse(req.body);
    const address = await usersService.addAddress(req.user!.id, validated);
    return sendSuccess(res, address, 'Address added successfully', 201);
  } catch (err: any) {
    return sendError(res, 'VALIDATION_ERROR', err.message || 'Invalid address format', 400);
  }
});

export const usersRouter = router;
