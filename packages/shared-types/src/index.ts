/**
 * FoodX Shared Types & Canonical Interfaces
 */

// ==========================================
// ENUMS
// ==========================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DONOR = 'DONOR',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  SUPERMARKET = 'SUPERMARKET',
  EVENT_ORGANIZER = 'EVENT_ORGANIZER',
  NGO = 'NGO',
  VOLUNTEER = 'VOLUNTEER',
  BENEFICIARY = 'BENEFICIARY',
  COMMUNITY_KITCHEN = 'COMMUNITY_KITCHEN'
}

export enum OrgStaffRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum FoodCategory {
  COOKED_MEALS = 'COOKED_MEALS',
  PACKAGED_FOOD = 'PACKAGED_FOOD',
  FRUITS = 'FRUITS',
  VEGETABLES = 'VEGETABLES',
  GROCERIES = 'GROCERIES',
  BAKERY = 'BAKERY',
  DAIRY = 'DAIRY',
  RESTAURANT_SURPLUS = 'RESTAURANT_SURPLUS',
  HOTEL_SURPLUS = 'HOTEL_SURPLUS',
  EVENT_SURPLUS = 'EVENT_SURPLUS',
  SUPERMARKET_SURPLUS = 'SUPERMARKET_SURPLUS',
  OTHER = 'OTHER'
}

export enum StorageCondition {
  ROOM_TEMPERATURE = 'ROOM_TEMPERATURE',
  REFRIGERATED = 'REFRIGERATED',
  FROZEN = 'FROZEN',
  HOT_HEATED = 'HOT_HEATED'
}

export enum DietaryFlag {
  VEGETARIAN = 'VEGETARIAN',
  NON_VEGETARIAN = 'NON_VEGETARIAN',
  VEGAN = 'VEGAN',
  JAIN = 'JAIN',
  HALAL = 'HALAL'
}

export enum DonationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  MATCHING = 'MATCHING',
  PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
  ACCEPTED = 'ACCEPTED',
  VOLUNTEER_ASSIGNED = 'VOLUNTEER_ASSIGNED',
  PICKUP_STARTED = 'PICKUP_STARTED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  DISTRIBUTED = 'DISTRIBUTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED'
}

export enum PriorityLevel {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY'
}

export enum VolunteerStatus {
  OFFLINE = 'OFFLINE',
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  ON_DELIVERY = 'ON_DELIVERY',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum DeliveryStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  ASSIGNED = 'ASSIGNED',
  PICKUP_EN_ROUTE = 'PICKUP_EN_ROUTE',
  PICKED_UP = 'PICKED_UP',
  DELIVERY_EN_ROUTE = 'DELIVERY_EN_ROUTE',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum ComplaintCategory {
  SPOILED_FOOD = 'SPOILED_FOOD',
  FAKE_DONATION = 'FAKE_DONATION',
  FAKE_NGO = 'FAKE_NGO',
  VOLUNTEER_MISCONDUCT = 'VOLUNTEER_MISCONDUCT',
  DONOR_MISCONDUCT = 'DONOR_MISCONDUCT',
  DELIVERY_ISSUE = 'DELIVERY_ISSUE',
  INCORRECT_INFORMATION = 'INCORRECT_INFORMATION',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  OTHER = 'OTHER'
}

export enum BadgeType {
  FIRST_DONATION = 'FIRST_DONATION',
  FOOD_SAVER = 'FOOD_SAVER',
  COMMUNITY_HERO = 'COMMUNITY_HERO',
  SUPER_DONOR = 'SUPER_DONOR',
  ZERO_WASTE_CHAMPION = 'ZERO_WASTE_CHAMPION',
  TOP_VOLUNTEER = 'TOP_VOLUNTEER',
  EMERGENCY_HERO = 'EMERGENCY_HERO'
}

export enum NotificationType {
  DONATION_CREATED = 'DONATION_CREATED',
  DONATION_ACCEPTED = 'DONATION_ACCEPTED',
  DONATION_REJECTED = 'DONATION_REJECTED',
  NGO_MATCHED = 'NGO_MATCHED',
  VOLUNTEER_ASSIGNED = 'VOLUNTEER_ASSIGNED',
  PICKUP_REMINDER = 'PICKUP_REMINDER',
  VOLUNTEER_ARRIVING = 'VOLUNTEER_ARRIVING',
  FOOD_PICKED_UP = 'FOOD_PICKED_UP',
  FOOD_IN_TRANSIT = 'FOOD_IN_TRANSIT',
  FOOD_DELIVERED = 'FOOD_DELIVERED',
  FOOD_EXPIRING = 'FOOD_EXPIRING',
  FOOD_EXPIRED = 'FOOD_EXPIRED',
  EMERGENCY_REQUEST = 'EMERGENCY_REQUEST',
  NEW_TASK = 'NEW_TASK',
  NEW_REVIEW = 'NEW_REVIEW',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  CERTIFICATE_AVAILABLE = 'CERTIFICATE_AVAILABLE',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

// ==========================================
// MODELS & DTO INTERFACES
// ==========================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressDTO {
  id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface UserProfileDTO {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  profilePhoto?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  totalDonations: number;
  totalMealsDonated: number;
  rating: number;
  address?: AddressDTO;
  createdAt: string;
  updatedAt: string;
}

export interface FoodDonationDTO {
  id: string;
  donorId: string;
  donorName?: string;
  donorRole?: UserRole;
  title: string;
  description?: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  numberOfMeals: number;
  dietaryFlags: DietaryFlag[];
  allergens: string[];
  preparationTime: string;
  expiryTime: string;
  storageCondition: StorageCondition;
  pickupAddress: AddressDTO;
  pickupStartTime: string;
  pickupEndTime: string;
  contactPerson: string;
  contactPhone: string;
  specialInstructions?: string;
  images: string[];
  status: DonationStatus;
  priority: PriorityLevel;
  acceptedByNgoId?: string;
  assignedVolunteerId?: string;
  qrCode?: string;
  otpCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodRequestDTO {
  id: string;
  requesterId: string;
  requesterName?: string;
  requesterRole: UserRole;
  title: string;
  description?: string;
  category: FoodCategory;
  mealsRequired: number;
  dietaryRequirements: DietaryFlag[];
  targetLocation: AddressDTO;
  requiredBy: string;
  priority: PriorityLevel;
  numberOfPeople: number;
  fulfilledMeals: number;
  isFulfilled: boolean;
  createdAt: string;
}

export interface MatchScoreDTO {
  ngoId: string;
  ngoName: string;
  distanceKm: number;
  distanceScore: number;
  foodTypeScore: number;
  quantityScore: number;
  urgencyScore: number;
  expiryScore: number;
  availabilityScore: number;
  overallScore: number;
}

export interface DeliveryDTO {
  id: string;
  donationId: string;
  donationTitle: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhone: string;
  ngoId: string;
  ngoName: string;
  status: DeliveryStatus;
  pickupAddress: AddressDTO;
  dropoffAddress: AddressDTO;
  currentLocation?: Coordinates;
  estimatedArrivalPickup?: string;
  estimatedArrivalDropoff?: string;
  distanceRemainingKm?: number;
  pickupProofUrl?: string;
  dropoffProofUrl?: string;
  pickupTime?: string;
  deliveredTime?: string;
  createdAt: string;
}

export interface ImpactStatsDTO {
  totalMealsRescued: number;
  totalFoodKgRescued: number;
  totalPeopleHelped: number;
  totalDonationsCompleted: number;
  activeVolunteersCount: number;
  partnerNgosCount: number;
  carbonEmissionsSavedKg: number;
  communityKitchensCount: number;
}

export interface LeaderboardEntryDTO {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  role: UserRole;
  points: number;
  mealsCount: number;
  badges: BadgeType[];
}

export interface CampaignDTO {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  organizationName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ==========================================
// MULTI-STOP ROUTE OPTIMIZER TYPES
// ==========================================

export enum WaypointType {
  START = 'START',
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF'
}

export interface RouteWaypoint {
  id: string;
  donationId?: string;
  type: WaypointType;
  title: string;
  address: AddressDTO;
  portions: number;
  contactName: string;
  contactPhone: string;
  urgency: PriorityLevel;
  estimatedArrivalMinutes?: number;
  distanceFromPreviousKm?: number;
}

export interface OptimizedRouteResult {
  courierStart: Coordinates;
  waypoints: RouteWaypoint[];
  totalStops: number;
  totalDistanceKm: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  percentageEfficiencyGain: number;
  totalEstimatedDurationMinutes: number;
  totalPortionsRescued: number;
  co2SavedKg: number;
  fuelCostSavedInr: number;
  polylinePath: Coordinates[];
}

export interface OptimizeRouteDto {
  courierLocation: Coordinates;
  waypoints: Array<{
    id: string;
    donationId?: string;
    type: WaypointType;
    title: string;
    address: AddressDTO;
    portions: number;
    contactName: string;
    contactPhone: string;
    urgency: PriorityLevel;
  }>;
}

