import { Router, Request, Response } from 'express';
import { authService } from './auth.service';
import { RegisterSchema, LoginSchema, OtpVerifySchema } from '@foodx/validation';
import { sendSuccess, sendError } from '../common/response';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const validated = RegisterSchema.parse(req.body);
    const result = await authService.register(validated);
    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (err: any) {
    return sendError(res, err.code || 'VALIDATION_ERROR', err.message || 'Invalid registration input', err.status || 400);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const result = await authService.login(validated);
    return sendSuccess(res, result, 'Login successful');
  } catch (err: any) {
    return sendError(res, err.code || 'AUTH_ERROR', err.message || 'Authentication failed', err.status || 401);
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'TOKEN_REQUIRED', 'Refresh token is required', 400);
    const tokens = await authService.refreshToken(refreshToken);
    return sendSuccess(res, tokens, 'Token refreshed successfully');
  } catch (err: any) {
    return sendError(res, err.code || 'REFRESH_ERROR', err.message || 'Failed to refresh token', err.status || 401);
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.logout(refreshToken);
  return sendSuccess(res, result, 'Logged out successfully');
});

router.post('/otp/send', async (req: Request, res: Response) => {
  const { phoneOrEmail } = req.body;
  if (!phoneOrEmail) return sendError(res, 'IDENTIFIER_REQUIRED', 'Phone or Email is required', 400);
  const result = await authService.sendOtp(phoneOrEmail);
  return sendSuccess(res, result, 'OTP sent successfully');
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, req.user, 'Current user profile');
});

export const authRouter = router;
