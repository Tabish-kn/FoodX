import { z } from 'zod';
import {
  UserRole,
  FoodCategory,
  StorageCondition,
  DietaryFlag,
  PriorityLevel,
  ComplaintCategory
} from '@foodx/shared-types';

// ==========================================
// AUTHENTICATION SCHEMAS
// ==========================================

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be valid').optional(),
  role: z.nativeEnum(UserRole),
  organizationName: z.string().optional(),
  registrationNumber: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const OtpVerifySchema = z.object({
  phoneOrEmail: z.string().min(1, 'Identifier required'),
  code: z.string().length(6, 'OTP must be 6 digits')
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
});

// ==========================================
// LOCATION & ADDRESS SCHEMAS
// ==========================================

export const AddressSchema = z.object({
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('India'),
  postalCode: z.string().min(4, 'Postal code is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isDefault: z.boolean().optional().default(false)
});

// ==========================================
// FOOD DONATION SCHEMAS
// ==========================================

export const BaseDonationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(FoodCategory),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required (e.g. kg, trays, packs)'),
  numberOfMeals: z.number().int().positive('Number of meals must be at least 1'),
  dietaryFlags: z.array(z.nativeEnum(DietaryFlag)).default([]),
  allergens: z.array(z.string()).default([]),
  preparationTime: z.string().datetime({ message: 'Valid preparation timestamp required' }),
  expiryTime: z.string().datetime({ message: 'Valid expiry timestamp required' }),
  storageCondition: z.nativeEnum(StorageCondition),
  pickupAddress: AddressSchema,
  pickupStartTime: z.string().datetime(),
  pickupEndTime: z.string().datetime(),
  contactPerson: z.string().min(2, 'Contact person name required'),
  contactPhone: z.string().min(10, 'Contact phone required'),
  specialInstructions: z.string().max(500).optional(),
  images: z.array(z.string().url()).default([])
});

export const CreateDonationSchema = BaseDonationSchema.refine(
  (data) => new Date(data.expiryTime) > new Date(data.preparationTime),
  {
    message: 'Expiry time must be after preparation time',
    path: ['expiryTime']
  }
).refine(
  (data) => new Date(data.pickupEndTime) > new Date(data.pickupStartTime),
  {
    message: 'Pickup end time must be after start time',
    path: ['pickupEndTime']
  }
);

export const UpdateDonationSchema = BaseDonationSchema.partial();

// ==========================================
// FOOD REQUEST SCHEMAS
// ==========================================

export const CreateFoodRequestSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(FoodCategory),
  mealsRequired: z.number().int().positive('Meals required must be > 0'),
  dietaryRequirements: z.array(z.nativeEnum(DietaryFlag)).default([]),
  targetLocation: AddressSchema,
  requiredBy: z.string().datetime(),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.NORMAL),
  numberOfPeople: z.number().int().positive().default(1)
});

// ==========================================
// VERIFICATION (QR & OTP) SCHEMAS
// ==========================================

export const VerifyPickupSchema = z.object({
  donationId: z.string().min(1, 'Donation ID is required'),
  qrToken: z.string().min(6, 'QR Token required'),
  otpCode: z.string().length(6, '6-digit OTP required'),
  proofPhotoUrl: z.string().url().optional()
});

export const VerifyDeliverySchema = z.object({
  deliveryId: z.string().min(1, 'Delivery ID is required'),
  qrToken: z.string().min(6, 'QR Token required'),
  otpCode: z.string().length(6, '6-digit OTP required'),
  proofPhotoUrl: z.string().url().optional()
});

// ==========================================
// REVIEWS & COMPLAINTS
// ==========================================

export const CreateReviewSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID required'),
  donationId: z.string().min(1, 'Donation ID required'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

export const CreateComplaintSchema = z.object({
  category: z.nativeEnum(ComplaintCategory),
  description: z.string().min(10, 'Please describe the issue in detail (min 10 chars)'),
  relatedDonationId: z.string().optional(),
  relatedUserId: z.string().optional(),
  attachments: z.array(z.string().url()).default([])
});

// ==========================================
// MULTI-STOP ROUTE OPTIMIZER SCHEMAS
// ==========================================

export const RouteWaypointInputSchema = z.object({
  id: z.string().min(1, 'Waypoint ID required'),
  donationId: z.string().optional(),
  type: z.enum(['START', 'PICKUP', 'DROPOFF']),
  title: z.string().min(1, 'Waypoint title required'),
  address: AddressSchema,
  portions: z.number().int().nonnegative().default(0),
  contactName: z.string().min(1, 'Contact person name required'),
  contactPhone: z.string().min(1, 'Contact phone required'),
  urgency: z.nativeEnum(PriorityLevel).default(PriorityLevel.NORMAL)
});

export const OptimizeRouteSchema = z.object({
  courierLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }),
  waypoints: z.array(RouteWaypointInputSchema).min(1, 'At least 1 waypoint required for route optimization')
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateDonationInput = z.infer<typeof CreateDonationSchema>;
export type CreateFoodRequestInput = z.infer<typeof CreateFoodRequestSchema>;
export type VerifyPickupInput = z.infer<typeof VerifyPickupSchema>;
export type VerifyDeliveryInput = z.infer<typeof VerifyDeliverySchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type CreateComplaintInput = z.infer<typeof CreateComplaintSchema>;
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteSchema>;

