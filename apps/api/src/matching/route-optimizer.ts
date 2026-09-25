/**
 * AI Smart Multi-Stop Route Optimizer & Rescue Batching Engine
 *
 * Optimizes courier multi-stop itineraries across multiple donor pickups
 * and distribution shelter dropoffs using Nearest Neighbor & 2-Opt local search.
 * Satisfies pickup-before-dropoff precedence constraints, minimizes fuel usage,
 * computes step-by-step ETAs, and quantifies carbon footprint reductions.
 */

import {
  Coordinates,
  OptimizedRouteResult,
  PriorityLevel,
  RouteWaypoint,
  WaypointType
} from '@foodx/shared-types';

export class RouteOptimizerService {
  private static readonly AVERAGE_COURIER_SPEED_KMH = 25;
  private static readonly SERVICE_TIME_PER_STOP_MIN = 5;
  private static readonly CO2_EMISSIONS_KG_PER_KM = 0.192; // Standard urban light cargo vehicle
  private static readonly FUEL_SAVINGS_INR_PER_KM = 8.5; // Average urban fuel expenditure

  /**
   * Calculates Haversine distance in kilometers between two geo-coordinates
   */
  public calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Generates an optimized multi-stop route from courier start location across all waypoints
   */
  public optimizeRoute(
    courierLocation: Coordinates,
    waypoints: RouteWaypoint[]
  ): OptimizedRouteResult {
    if (!waypoints || waypoints.length === 0) {
      return {
        courierStart: courierLocation,
        waypoints: [],
        totalStops: 0,
        totalDistanceKm: 0,
        unoptimizedDistanceKm: 0,
        distanceSavedKm: 0,
        percentageEfficiencyGain: 0,
        totalEstimatedDurationMinutes: 0,
        totalPortionsRescued: 0,
        co2SavedKg: 0,
        fuelCostSavedInr: 0,
        polylinePath: [courierLocation]
      };
    }

    // 1. Calculate unoptimized (input sequence) baseline distance
    let unoptimizedDistance = 0;
    let prevLoc = courierLocation;
    for (const wp of waypoints) {
      unoptimizedDistance += this.calculateDistanceKm(
        prevLoc.latitude,
        prevLoc.longitude,
        wp.address.latitude,
        wp.address.longitude
      );
      prevLoc = { latitude: wp.address.latitude, longitude: wp.address.longitude };
    }

    // 2. Separate into Pickups and Dropoffs to satisfy precedence constraints
    const pickups = waypoints.filter((w) => w.type === WaypointType.PICKUP);
    const dropoffs = waypoints.filter((w) => w.type === WaypointType.DROPOFF);
    const otherWaypoints = waypoints.filter(
      (w) => w.type !== WaypointType.PICKUP && w.type !== WaypointType.DROPOFF
    );

    // 3. Optimize Pickups first using Nearest Neighbor with Urgency weighting
    const optimizedPickups = this.solveNearestNeighbor(courierLocation, pickups);

    // 4. Optimize Dropoffs from the last pickup location
    const lastPickupLoc =
      optimizedPickups.length > 0
        ? {
            latitude: optimizedPickups[optimizedPickups.length - 1].address.latitude,
            longitude: optimizedPickups[optimizedPickups.length - 1].address.longitude
          }
        : courierLocation;

    const optimizedDropoffs = this.solveNearestNeighbor(lastPickupLoc, dropoffs);

    // Combine into final ordered sequence
    let orderedWaypoints = [...optimizedPickups, ...optimizedDropoffs, ...otherWaypoints];

    // If only 1 or 2 items, 2-opt is not needed; otherwise run 2-opt refinement on segments
    if (orderedWaypoints.length >= 4) {
      orderedWaypoints = this.applyTwoOptRefinement(courierLocation, orderedWaypoints);
    }

    // 5. Compute step-by-step distances, ETAs, and cumulative statistics
    let totalOptimizedDistance = 0;
    let cumulativeMinutes = 0;
    let totalPortions = 0;
    let currentCoord = courierLocation;

    const populatedWaypoints: RouteWaypoint[] = [];
    const polylinePath: Coordinates[] = [courierLocation];

    for (const wp of orderedWaypoints) {
      const stepDistance = this.calculateDistanceKm(
        currentCoord.latitude,
        currentCoord.longitude,
        wp.address.latitude,
        wp.address.longitude
      );

      totalOptimizedDistance += stepDistance;
      const travelMinutes = Math.round((stepDistance / RouteOptimizerService.AVERAGE_COURIER_SPEED_KMH) * 60);
      cumulativeMinutes += travelMinutes + RouteOptimizerService.SERVICE_TIME_PER_STOP_MIN;
      if (wp.type === WaypointType.PICKUP) {
        totalPortions += wp.portions || 0;
      }

      populatedWaypoints.push({
        ...wp,
        distanceFromPreviousKm: stepDistance,
        estimatedArrivalMinutes: cumulativeMinutes
      });

      const nextCoord = { latitude: wp.address.latitude, longitude: wp.address.longitude };
      polylinePath.push(nextCoord);
      currentCoord = nextCoord;
    }

    totalOptimizedDistance = parseFloat(totalOptimizedDistance.toFixed(2));
    unoptimizedDistance = parseFloat(unoptimizedDistance.toFixed(2));

    const distanceSaved = parseFloat(
      Math.max(0, unoptimizedDistance - totalOptimizedDistance).toFixed(2)
    );
    const efficiencyGain =
      unoptimizedDistance > 0
        ? parseFloat(((distanceSaved / unoptimizedDistance) * 100).toFixed(1))
        : 0;

    const co2Saved = parseFloat(
      (distanceSaved * RouteOptimizerService.CO2_EMISSIONS_KG_PER_KM).toFixed(2)
    );
    const fuelCostSaved = parseFloat(
      (distanceSaved * RouteOptimizerService.FUEL_SAVINGS_INR_PER_KM).toFixed(2)
    );

    return {
      courierStart: courierLocation,
      waypoints: populatedWaypoints,
      totalStops: populatedWaypoints.length,
      totalDistanceKm: totalOptimizedDistance,
      unoptimizedDistanceKm: unoptimizedDistance,
      distanceSavedKm: distanceSaved,
      percentageEfficiencyGain: efficiencyGain,
      totalEstimatedDurationMinutes: cumulativeMinutes,
      totalPortionsRescued: totalPortions,
      co2SavedKg: co2Saved,
      fuelCostSavedInr: fuelCostSaved,
      polylinePath
    };
  }

  /**
   * Nearest Neighbor heuristic with urgency penalty reduction
   */
  private solveNearestNeighbor(start: Coordinates, nodes: RouteWaypoint[]): RouteWaypoint[] {
    if (nodes.length <= 1) return [...nodes];

    const unvisited = [...nodes];
    const route: RouteWaypoint[] = [];
    let current = start;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minScore = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const candidate = unvisited[i];
        const dist = this.calculateDistanceKm(
          current.latitude,
          current.longitude,
          candidate.address.latitude,
          candidate.address.longitude
        );

        // Urgency factor reduces effective cost so high-priority rescue batches are visited sooner
        const urgencyMultiplier =
          candidate.urgency === PriorityLevel.EMERGENCY
            ? 0.4
            : candidate.urgency === PriorityLevel.URGENT
            ? 0.7
            : candidate.urgency === PriorityLevel.HIGH
            ? 0.85
            : 1.0;

        const effectiveCost = dist * urgencyMultiplier;

        if (effectiveCost < minScore) {
          minScore = effectiveCost;
          nearestIndex = i;
        }
      }

      const nextNode = unvisited.splice(nearestIndex, 1)[0];
      route.push(nextNode);
      current = {
        latitude: nextNode.address.latitude,
        longitude: nextNode.address.longitude
      };
    }

    return route;
  }

  /**
   * 2-Opt local search improvement for intra-route crossover reduction
   */
  private applyTwoOptRefinement(start: Coordinates, route: RouteWaypoint[]): RouteWaypoint[] {
    let best = [...route];
    let improved = true;
    let iteration = 0;
    const maxIterations = 50;

    while (improved && iteration < maxIterations) {
      improved = false;
      iteration++;

      for (let i = 0; i < best.length - 1; i++) {
        for (let k = i + 1; k < best.length; k++) {
          // Check precedence: Never place a dropoff before a pickup of the same donation
          if (this.violatesPrecedence(best, i, k)) continue;

          const currentDist = this.calculateTotalRouteDistance(start, best);
          const newRoute = this.twoOptSwap(best, i, k);
          const newDist = this.calculateTotalRouteDistance(start, newRoute);

          if (newDist < currentDist - 0.05) {
            best = newRoute;
            improved = true;
            break;
          }
        }
        if (improved) break;
      }
    }

    return best;
  }

  private twoOptSwap(route: RouteWaypoint[], i: number, k: number): RouteWaypoint[] {
    const swapped = [...route.slice(0, i), ...route.slice(i, k + 1).reverse(), ...route.slice(k + 1)];
    return swapped;
  }

  private violatesPrecedence(route: RouteWaypoint[], i: number, k: number): boolean {
    const candidate = this.twoOptSwap(route, i, k);
    const seenPickups = new Set<string>();

    for (const wp of candidate) {
      if (wp.type === WaypointType.PICKUP && wp.donationId) {
        seenPickups.add(wp.donationId);
      } else if (wp.type === WaypointType.DROPOFF && wp.donationId) {
        if (!seenPickups.has(wp.donationId)) {
          return true; // Dropping off before picking up
        }
      }
    }
    return false;
  }

  private calculateTotalRouteDistance(start: Coordinates, route: RouteWaypoint[]): number {
    let total = 0;
    let prev = start;
    for (const wp of route) {
      total += this.calculateDistanceKm(
        prev.latitude,
        prev.longitude,
        wp.address.latitude,
        wp.address.longitude
      );
      prev = { latitude: wp.address.latitude, longitude: wp.address.longitude };
    }
    return total;
  }
}
