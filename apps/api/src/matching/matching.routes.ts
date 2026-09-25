import { Router, Request, Response } from 'express';
import { matchingService } from './matching.service';
import { RouteOptimizerService } from './route-optimizer';
import { OptimizeRouteSchema } from '@foodx/validation';
import { requireAuth, AuthenticatedRequest } from '../common/middleware';
import { sendSuccess, sendError } from '../common/response';

const router = Router();
const routeOptimizer = new RouteOptimizerService();

/**
 * POST /api/v1/matching/optimize-route
 * Computes optimal multi-stop itinerary and CO2 reduction metrics for couriers
 */
router.post('/optimize-route', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = OptimizeRouteSchema.parse(req.body);
    const result = routeOptimizer.optimizeRoute(
      validated.courierLocation,
      validated.waypoints as any
    );
    return sendSuccess(res, result, 'Multi-stop route optimized successfully');
  } catch (err: any) {
    return sendError(
      res,
      'ROUTE_OPTIMIZATION_ERROR',
      err.message || 'Failed to optimize multi-stop route',
      400
    );
  }
});

/**
 * GET /api/v1/matching/donations/:id
 * Computes AI smart matching scores for an active food donation
 */
router.get('/donations/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const matches = await matchingService.findMatchesForDonation(req.params.id);
    return sendSuccess(res, matches, 'AI matching scores computed successfully');
  } catch (err: any) {
    return sendError(
      res,
      'MATCHING_ERROR',
      err.message || 'Failed to compute matches',
      500
    );
  }
});

export const matchingRouter = router;
