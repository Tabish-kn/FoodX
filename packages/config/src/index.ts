import { UserRole, BadgeType } from '@foodx/shared-types';

export const APP_CONFIG = {
  name: 'FoodX',
  tagline: 'Bridging Hunger with Surplus — Real-Time Food Rescue Network',
  version: '1.0.0',
  defaultServiceRadiusKm: 25,
  maxDonationMeals: 5000,
  defaultCurrency: 'INR'
};

// AI Matching Weights configuration
export const MATCHING_WEIGHTS = {
  distance: 0.35,       // Proximity is paramount for hot/perishable rescue
  urgency: 0.25,        // Remaining expiry duration
  quantityFit: 0.15,    // Match donor meals to beneficiary intake capacity
  foodType: 0.15,       // Dietary compatibility (veg/vegan/halal)
  availability: 0.10    // Volunteer active readiness nearby
};

// Expiry urgency escalation thresholds (in hours)
export const EXPIRY_THRESHOLDS = {
  NORMAL_HOURS: 6,     // > 6 hours left
  HIGH_HOURS: 3,       // 3 - 6 hours left
  URGENT_HOURS: 1,     // 1 - 3 hours left
  EMERGENCY_HOURS: 0   // < 1 hour left
};

// Gamification Points System
export const GAMIFICATION_POINTS = {
  DONATION_CREATED: 50,
  DONATION_COMPLETED: 150,
  DELIVERY_COMPLETED: 200,
  EMERGENCY_DELIVERY_BONUS: 100,
  FIVE_STAR_REVIEW_BONUS: 50
};

// Badges Criteria
export const BADGE_DEFINITIONS: Record<BadgeType, { title: string; description: string; icon: string; threshold: number }> = {
  [BadgeType.FIRST_DONATION]: {
    title: 'First Step Savior',
    description: 'Created your very first food donation listing',
    icon: '🌱',
    threshold: 1
  },
  [BadgeType.FOOD_SAVER]: {
    title: 'Food Rescue Pioneer',
    description: 'Rescued over 100 meals from going to waste',
    icon: '🥗',
    threshold: 100
  },
  [BadgeType.COMMUNITY_HERO]: {
    title: 'Community Hero',
    description: 'Rescued over 500 meals for local charities',
    icon: '⭐',
    threshold: 500
  },
  [BadgeType.SUPER_DONOR]: {
    title: 'Super Donor',
    description: 'Donated over 2,000 meals to emergency relief programs',
    icon: '🏆',
    threshold: 2000
  },
  [BadgeType.ZERO_WASTE_CHAMPION]: {
    title: 'Zero Waste Champion',
    description: 'Logged 20+ zero-waste donation cycles without spoilage',
    icon: '♻️',
    threshold: 20
  },
  [BadgeType.TOP_VOLUNTEER]: {
    title: 'Golden Courier',
    description: 'Successfully completed 50+ volunteer delivery runs',
    icon: '🚴',
    threshold: 50
  },
  [BadgeType.EMERGENCY_HERO]: {
    title: 'Rapid Responder',
    description: 'Responded to 10+ critical emergency food requests within 30 minutes',
    icon: '🚨',
    threshold: 10
  }
};

// Role Access Matrix
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['*'],
  [UserRole.ADMIN]: [
    'users:read', 'users:write', 'users:verify',
    'donations:manage', 'deliveries:manage', 'reports:read',
    'complaints:manage', 'audit:read', 'settings:write'
  ],
  [UserRole.DONOR]: [
    'donations:create', 'donations:read_own', 'donations:cancel_own',
    'reviews:create', 'impact:read_own', 'certificates:read'
  ],
  [UserRole.RESTAURANT]: [
    'donations:create', 'donations:bulk_create', 'donations:read_own',
    'organization:manage', 'analytics:read', 'certificates:read'
  ],
  [UserRole.HOTEL]: [
    'donations:create', 'donations:bulk_create', 'donations:read_own',
    'organization:manage', 'analytics:read', 'certificates:read'
  ],
  [UserRole.SUPERMARKET]: [
    'donations:create', 'donations:bulk_create', 'donations:read_own',
    'organization:manage', 'analytics:read', 'certificates:read'
  ],
  [UserRole.EVENT_ORGANIZER]: [
    'donations:create', 'donations:read_own', 'certificates:read'
  ],
  [UserRole.NGO]: [
    'donations:browse', 'donations:accept', 'requests:create',
    'requests:read_own', 'distribution:record', 'deliveries:confirm',
    'volunteers:assign'
  ],
  [UserRole.VOLUNTEER]: [
    'tasks:browse', 'tasks:accept', 'deliveries:execute',
    'qr:verify', 'otp:verify', 'rewards:read'
  ],
  [UserRole.BENEFICIARY]: [
    'requests:create', 'requests:read_own', 'deliveries:track',
    'feedback:create'
  ],
  [UserRole.COMMUNITY_KITCHEN]: [
    'kitchen:manage', 'meals:record', 'inventory:request',
    'donations:receive', 'distribution:record'
  ]
};
