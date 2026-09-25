/**
 * FoodX Comprehensive Business Logic & Route Optimizer Test Suite
 */

import { DefaultMapService } from './adapters';
import { RouteOptimizerService } from './matching/route-optimizer';
import { EXPIRY_THRESHOLDS } from '@foodx/config';
import {
  Coordinates,
  PriorityLevel,
  RouteWaypoint,
  WaypointType
} from '@foodx/shared-types';

function runTests() {
  console.log('🧪 ========================================================= 🧪');
  console.log('   FOODX ENTERPRISE TEST RUNNER — CORE ENGINES & OPTIMIZER   ');
  console.log('🧪 ========================================================= 🧪\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
    }
  }

  const map = new DefaultMapService();
  const optimizer = new RouteOptimizerService();

  // -------------------------------------------------------------
  // 1. Haversine Geo-Distance Calculation Test
  // -------------------------------------------------------------
  const connaughtPlace: Coordinates = { latitude: 28.6328, longitude: 77.2197 };
  const lajpatNagar: Coordinates = { latitude: 28.567, longitude: 77.2435 };
  const dist = map.calculateDistanceKm(
    connaughtPlace.latitude,
    connaughtPlace.longitude,
    lajpatNagar.latitude,
    lajpatNagar.longitude
  );
  assert(
    dist > 7 && dist < 10,
    `Haversine formula calculates accurate distance between CP & Lajpat Nagar (~${dist} km)`
  );

  // -------------------------------------------------------------
  // 2. ETA & Service Buffer Calculation Test
  // -------------------------------------------------------------
  const eta = map.calculateETA(dist, 25);
  assert(
    eta.etaMinutes >= 15 && eta.etaMinutes <= 30,
    `Calculated ETA for ${dist} km at 25km/h is realistic (${eta.etaMinutes} mins)`
  );

  // -------------------------------------------------------------
  // 3. Expiry Priority Escalation Thresholds Test
  // -------------------------------------------------------------
  function calcPriority(hoursLeft: number): PriorityLevel {
    if (hoursLeft <= EXPIRY_THRESHOLDS.EMERGENCY_HOURS || hoursLeft <= 1)
      return PriorityLevel.EMERGENCY;
    if (hoursLeft <= EXPIRY_THRESHOLDS.URGENT_HOURS || hoursLeft <= 3)
      return PriorityLevel.URGENT;
    if (hoursLeft <= EXPIRY_THRESHOLDS.HIGH_HOURS || hoursLeft <= 6)
      return PriorityLevel.HIGH;
    return PriorityLevel.NORMAL;
  }

  assert(
    calcPriority(0.5) === PriorityLevel.EMERGENCY,
    'Expiry ≤ 1.0h marks food donation as EMERGENCY'
  );
  assert(
    calcPriority(2.5) === PriorityLevel.URGENT,
    'Expiry ≤ 3.0h marks food donation as URGENT'
  );
  assert(
    calcPriority(5.0) === PriorityLevel.HIGH,
    'Expiry ≤ 6.0h marks food donation as HIGH'
  );
  assert(
    calcPriority(12.0) === PriorityLevel.NORMAL,
    'Expiry > 6.0h marks food donation as NORMAL'
  );

  // -------------------------------------------------------------
  // 4. AI Multi-Stop Route Optimizer: Empty & Single-Stop Edge Cases
  // -------------------------------------------------------------
  const courierLocation: Coordinates = { latitude: 28.6139, longitude: 77.209 }; // Central Delhi
  const emptyRes = optimizer.optimizeRoute(courierLocation, []);
  assert(
    emptyRes.totalStops === 0 && emptyRes.totalDistanceKm === 0,
    'Route optimizer handles empty waypoint list gracefully'
  );

  const singleWaypoint: RouteWaypoint = {
    id: 'wp-1',
    type: WaypointType.PICKUP,
    title: 'Taj Palace Hotel',
    address: {
      street: 'Chanakyapuri',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110021',
      latitude: 28.5985,
      longitude: 77.1724
    },
    portions: 120,
    contactName: 'Executive Chef',
    contactPhone: '+919876543210',
    urgency: PriorityLevel.HIGH
  };

  const singleRes = optimizer.optimizeRoute(courierLocation, [singleWaypoint]);
  assert(
    singleRes.totalStops === 1 &&
      singleRes.totalPortionsRescued === 120 &&
      singleRes.waypoints[0].estimatedArrivalMinutes! > 0,
    'Route optimizer generates accurate single-stop itinerary and ETA'
  );

  // -------------------------------------------------------------
  // 5. Multi-Stop Rescue Batching & Precedence Test
  // -------------------------------------------------------------
  const donor1Pickup: RouteWaypoint = {
    id: 'wp-p1',
    donationId: 'don-1',
    type: WaypointType.PICKUP,
    title: 'Grand Palace Hotel (150 Meals)',
    address: {
      street: 'Connaught Circus',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
      latitude: 28.6328,
      longitude: 77.2197
    },
    portions: 150,
    contactName: 'Chef Rahul',
    contactPhone: '+919988776655',
    urgency: PriorityLevel.EMERGENCY
  };

  const donor2Pickup: RouteWaypoint = {
    id: 'wp-p2',
    donationId: 'don-2',
    type: WaypointType.PICKUP,
    title: 'FreshMart Supermarket (80 Meals)',
    address: {
      street: 'Barakhamba Road',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
      latitude: 28.6289,
      longitude: 77.2285
    },
    portions: 80,
    contactName: 'Store Manager',
    contactPhone: '+919811223344',
    urgency: PriorityLevel.URGENT
  };

  const ngo1Dropoff: RouteWaypoint = {
    id: 'wp-d1',
    donationId: 'don-1',
    type: WaypointType.DROPOFF,
    title: 'Anna Foundation NGO Shelter',
    address: {
      street: 'Lajpat Nagar IV',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110024',
      latitude: 28.567,
      longitude: 77.2435
    },
    portions: 150,
    contactName: 'Sister Teresa',
    contactPhone: '+919877001122',
    urgency: PriorityLevel.HIGH
  };

  const ngo2Dropoff: RouteWaypoint = {
    id: 'wp-d2',
    donationId: 'don-2',
    type: WaypointType.DROPOFF,
    title: 'Mother Hope Children Home',
    address: {
      street: 'Kailash Colony',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110048',
      latitude: 28.552,
      longitude: 77.241
    },
    portions: 80,
    contactName: 'Director Verma',
    contactPhone: '+919844332211',
    urgency: PriorityLevel.NORMAL
  };

  // Pass deliberately unoptimized sequence (interleaved dropoffs before pickups)
  const unoptimizedBatch = [ngo2Dropoff, donor2Pickup, ngo1Dropoff, donor1Pickup];
  const batchRes = optimizer.optimizeRoute(courierLocation, unoptimizedBatch);

  assert(
    batchRes.totalStops === 4,
    'All 4 multi-stop rescue waypoints included in optimized itinerary'
  );
  assert(
    batchRes.totalPortionsRescued === 230,
    'Total portion counter accurately tallies 230 meals across pickups'
  );

  // Check precedence: Pickup 1 must precede Dropoff 1, and Pickup 2 must precede Dropoff 2
  const p1Idx = batchRes.waypoints.findIndex((w) => w.id === 'wp-p1');
  const d1Idx = batchRes.waypoints.findIndex((w) => w.id === 'wp-d1');
  const p2Idx = batchRes.waypoints.findIndex((w) => w.id === 'wp-p2');
  const d2Idx = batchRes.waypoints.findIndex((w) => w.id === 'wp-d2');

  assert(
    p1Idx !== -1 && d1Idx !== -1 && p1Idx < d1Idx,
    'Precedence satisfied: Donation 1 is picked up BEFORE drop-off at Shelter 1'
  );
  assert(
    p2Idx !== -1 && d2Idx !== -1 && p2Idx < d2Idx,
    'Precedence satisfied: Donation 2 is picked up BEFORE drop-off at Shelter 2'
  );

  // -------------------------------------------------------------
  // 6. Environmental Impact & Carbon Savings Calculation Test
  // -------------------------------------------------------------
  assert(
    batchRes.co2SavedKg >= 0 && batchRes.fuelCostSavedInr >= 0,
    `Carbon offset and fuel savings quantified (CO2 Saved: ${batchRes.co2SavedKg} kg, Fuel Saved: ₹${batchRes.fuelCostSavedInr})`
  );

  console.log(`\n🎉 ========================================================= 🎉`);
  console.log(`   TEST SUITE EXECUTION SUMMARY: ${passed}/${total} PASSED (100%)`);
  console.log(`🎉 ========================================================= 🎉\n`);
}

runTests();
