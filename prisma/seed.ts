import { PrismaClient, UserRole, VerificationStatus, FoodCategoryType, StorageCondition, DietaryFlag, DonationStatus, PriorityLevel, DeliveryStatus, BadgeType, ComplaintCategory, ComplaintStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FoodX Database Seeding...');

  // 1. Clean existing records safely
  await prisma.auditLog.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.userBadge.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.oTPVerification.deleteMany({});
  await prisma.qRToken.deleteMany({});
  await prisma.delivery.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.donationImage.deleteMany({});
  await prisma.foodDonation.deleteMany({});
  await prisma.foodRequest.deleteMany({});
  await prisma.communityKitchen.deleteMany({});
  await prisma.beneficiaryProfile.deleteMany({});
  await prisma.volunteerProfile.deleteMany({});
  await prisma.nGOProfile.deleteMany({});
  await prisma.donorProfile.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemSetting.deleteMany({});

  // Placeholder argon2/bcrypt hash for "Password123!"
  const defaultPasswordHash = '$2b$10$wN9a8a7H14JdEvdKk8r89uH2uYvXJ9LhYtF1O.K.fPqZkZ7p5hM2C';

  // 2. System Settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'MATCHING_RADIUS_KM', value: '25', description: 'Default radius for matching NGOs to donations' },
      { key: 'AUTO_EXPIRE_HOURS', value: '6', description: 'Threshold to escalate expiring food' },
      { key: 'DEMO_MODE', value: 'true', description: 'Enable simulated live drivers and mock OTP verification' }
    ]
  });

  // 3. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@foodx.org',
      passwordHash: defaultPasswordHash,
      phone: '+919876543200',
      fullName: 'Chief Administrator',
      role: UserRole.SUPER_ADMIN,
      verificationStatus: VerificationStatus.VERIFIED,
      totalDonations: 0,
      rewardPoints: 1000
    }
  });

  // 4. Donors (Restaurant, Hotel, Supermarket, Individual)
  const restaurantUser = await prisma.user.create({
    data: {
      email: 'chef@tajpalace.com',
      passwordHash: defaultPasswordHash,
      phone: '+919876543201',
      fullName: 'Grand Palace Hotel & Banquets',
      role: UserRole.HOTEL,
      verificationStatus: VerificationStatus.VERIFIED,
      totalDonations: 42,
      totalMealsDonated: 4800,
      rewardPoints: 6500,
      rating: 4.9,
      ratingCount: 38,
      donorProfile: {
        create: {
          organizationName: 'Grand Palace Hospitality Ltd.',
          businessType: '5-Star Hotel & Banquet',
          licenseNumber: 'FSSAI-110022998811',
          bio: 'Committed to 100% zero food waste across all our buffet and banquet operations.'
        }
      },
      addresses: {
        create: {
          street: '12 MG Road, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110001',
          latitude: 28.6328,
          longitude: 77.2197,
          isDefault: true,
          label: 'Main Banquet Kitchen'
        }
      }
    },
    include: { addresses: true, donorProfile: true }
  });

  const supermarketUser = await prisma.user.create({
    data: {
      email: 'manager@freshmart.in',
      passwordHash: defaultPasswordHash,
      phone: '+919876543202',
      fullName: 'FreshMart Superstore #104',
      role: UserRole.SUPERMARKET,
      verificationStatus: VerificationStatus.VERIFIED,
      totalDonations: 85,
      totalMealsDonated: 9200,
      rewardPoints: 12000,
      rating: 4.8,
      ratingCount: 75,
      donorProfile: {
        create: {
          organizationName: 'FreshMart Retail Network',
          businessType: 'Supermarket',
          licenseNumber: 'FSSAI-994433221100',
          bio: 'Daily fresh bakery, fruits, and surplus dairy donation drive.'
        }
      },
      addresses: {
        create: {
          street: '45 South Ext Block 2',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110049',
          latitude: 28.5684,
          longitude: 77.2215,
          isDefault: true,
          label: 'Supermarket Loading Bay 2'
        }
      }
    },
    include: { addresses: true, donorProfile: true }
  });

  // 5. NGO Users
  const ngoUser1 = await prisma.user.create({
    data: {
      email: 'director@annafoundation.org',
      passwordHash: defaultPasswordHash,
      phone: '+919876543210',
      fullName: 'Anna Foundation for Food Security',
      role: UserRole.NGO,
      verificationStatus: VerificationStatus.VERIFIED,
      rewardPoints: 8500,
      rating: 5.0,
      ratingCount: 42,
      ngoProfile: {
        create: {
          organizationName: 'Anna Foundation NGO',
          registrationNumber: 'NGO-DL-2018-8821',
          description: 'Distributing warm cooked meals to 1,500 daily wage workers and shelter homes.',
          serviceRadiusKm: 20.0,
          beneficiaryCount: 1500,
          isVerified: true,
          foodPreferences: ['COOKED_MEALS', 'BAKERY', 'GROCERIES']
        }
      },
      addresses: {
        create: {
          street: '88 Okhla Phase 3 Hub',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110020',
          latitude: 28.5284,
          longitude: 77.2715,
          isDefault: true,
          label: 'Distribution Center 1'
        }
      }
    },
    include: { addresses: true, ngoProfile: true }
  });

  const ngoUser2 = await prisma.user.create({
    data: {
      email: 'help@childcareshelter.org',
      passwordHash: defaultPasswordHash,
      phone: '+919876543211',
      fullName: 'Hope & Nutrition Children Shelter',
      role: UserRole.NGO,
      verificationStatus: VerificationStatus.VERIFIED,
      rewardPoints: 4200,
      rating: 4.9,
      ratingCount: 22,
      ngoProfile: {
        create: {
          organizationName: 'Hope & Nutrition Shelter',
          registrationNumber: 'NGO-DL-2020-5512',
          description: 'Supporting 300 underprivileged kids with daily healthy nutrition and fruits.',
          serviceRadiusKm: 15.0,
          beneficiaryCount: 300,
          isVerified: true,
          foodPreferences: ['FRUITS', 'DAIRY', 'COOKED_MEALS', 'BAKERY']
        }
      },
      addresses: {
        create: {
          street: '14 Lajpat Nagar IV',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110024',
          latitude: 28.5670,
          longitude: 77.2435,
          isDefault: true,
          label: 'Shelter Kitchen'
        }
      }
    },
    include: { addresses: true, ngoProfile: true }
  });

  // 6. Volunteers
  const volunteerUser = await prisma.user.create({
    data: {
      email: 'alex.volunteer@gmail.com',
      passwordHash: defaultPasswordHash,
      phone: '+919876543220',
      fullName: 'Alex Sharma (Rapid Courier)',
      role: UserRole.VOLUNTEER,
      verificationStatus: VerificationStatus.VERIFIED,
      rewardPoints: 3400,
      rating: 4.95,
      ratingCount: 48,
      volunteerProfile: {
        create: {
          vehicleType: 'Electric Scooter (Insulated Cargo Box)',
          licenseNumber: 'DL-04-2022-009988',
          serviceRadiusKm: 12.0,
          currentLatitude: 28.5912,
          currentLongitude: 77.2301,
          isVerified: true,
          emergencyContact: '+919876543299'
        }
      },
      addresses: {
        create: {
          street: '22 Hauz Khas Enclave',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110016',
          latitude: 28.5494,
          longitude: 77.2001,
          isDefault: true
        }
      }
    },
    include: { addresses: true, volunteerProfile: true }
  });

  // 7. Community Kitchen
  await prisma.communityKitchen.create({
    data: {
      userId: adminUser.id,
      name: 'Central Jan Aahar Community Kitchen',
      capacityDailyMeals: 1200,
      mealsServedToday: 640,
      operatingHours: '07:00 AM - 09:00 PM',
      dailyMenu: 'Dal Rice, Mixed Vegetable Sabzi, Fresh Roti & Fruit',
      latitude: 28.5800,
      longitude: 77.2200,
      address: 'Near AIIMS Metro Station, Ring Road, New Delhi'
    }
  });

  // 8. Active Food Donations
  const now = new Date();
  const prepTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const expirySoon = new Date(now.getTime() + 3.5 * 60 * 60 * 1000); // 3.5 hours left (High Priority)
  const expiryTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Live in-transit donation
  const donationInTransit = await prisma.foodDonation.create({
    data: {
      donorId: restaurantUser.id,
      title: '150 Portions Royal Veg Biryani & Paneer Gravy',
      description: 'Freshly prepared from afternoon corporate lunch symposium. Stored in hot insulated stainless steel containers.',
      category: FoodCategoryType.HOTEL_SURPLUS,
      quantity: 45,
      unit: 'kg',
      numberOfMeals: 150,
      dietaryFlags: [DietaryFlag.VEGETARIAN, DietaryFlag.HALAL],
      allergens: ['Dairy (Paneer)'],
      preparationTime: prepTime,
      expiryTime: expirySoon,
      storageCondition: StorageCondition.HOT_HEATED,
      pickupAddressId: restaurantUser.addresses[0].id,
      pickupStartTime: prepTime,
      pickupEndTime: expirySoon,
      contactPerson: 'Chef Vikramaditya',
      contactPhone: '+919876543201',
      status: DonationStatus.IN_TRANSIT,
      priority: PriorityLevel.HIGH,
      acceptedByNgoId: ngoUser1.ngoProfile!.id,
      assignedVolunteerId: volunteerUser.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' }
        ]
      }
    }
  });

  // QR Token and OTP for In-Transit Donation
  await prisma.qRToken.create({
    data: {
      donationId: donationInTransit.id,
      pickupToken: 'QR-PK-99281-CONFIRMED',
      deliveryToken: 'QR-DL-77319-PENDING',
      isPickupUsed: true,
      isDeliveryUsed: false,
      expiresAt: expiryTomorrow
    }
  });

  await prisma.oTPVerification.create({
    data: {
      donationId: donationInTransit.id,
      pickupOtp: '482910',
      deliveryOtp: '719384',
      isPickupUsed: true,
      isDeliveryUsed: false,
      expiresAt: expiryTomorrow
    }
  });

  // Create Active Delivery Record with live coordinates
  const activeDelivery = await prisma.delivery.create({
    data: {
      donationId: donationInTransit.id,
      volunteerId: volunteerUser.id,
      ngoUserId: ngoUser1.id,
      status: DeliveryStatus.DELIVERY_EN_ROUTE,
      pickupLatitude: restaurantUser.addresses[0].latitude,
      pickupLongitude: restaurantUser.addresses[0].longitude,
      pickupAddressText: restaurantUser.addresses[0].street + ', ' + restaurantUser.addresses[0].city,
      dropoffLatitude: ngoUser1.addresses[0].latitude,
      dropoffLongitude: ngoUser1.addresses[0].longitude,
      dropoffAddressText: ngoUser1.addresses[0].street + ', ' + ngoUser1.addresses[0].city,
      currentLatitude: 28.5800,
      currentLongitude: 77.2450,
      distanceRemainingKm: 4.2,
      etaMinutes: 14,
      pickupVerifiedAt: new Date(now.getTime() - 25 * 60 * 1000)
    }
  });

  // Chat conversation for the delivery
  const deliveryChat = await prisma.chat.create({
    data: {
      deliveryId: activeDelivery.id
    }
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        chatId: deliveryChat.id,
        senderId: restaurantUser.id,
        content: 'Hi Alex, the 3 hot food containers are packed and sealed in loading bay 1.'
      },
      {
        chatId: deliveryChat.id,
        senderId: volunteerUser.id,
        content: 'Picked up successfully! Food is hot and secure in insulated box. Heading to Anna Foundation now.'
      },
      {
        chatId: deliveryChat.id,
        senderId: ngoUser1.id,
        content: 'Thanks Alex! Our volunteers are waiting at Gate 2 with trolley ready for drop-off.'
      }
    ]
  });

  // Available Donation Ready to Accept
  await prisma.foodDonation.create({
    data: {
      donorId: supermarketUser.id,
      title: '80kg Fresh Farm Apples, Oranges & Whole Wheat Breads',
      description: 'Premium quality daily surplus fruits and bakery loaves. Clean, sorted, ready for immediate distribution.',
      category: FoodCategoryType.FRUITS,
      quantity: 80,
      unit: 'kg',
      numberOfMeals: 220,
      dietaryFlags: [DietaryFlag.VEGAN, DietaryFlag.VEGETARIAN],
      allergens: ['Gluten (in bread)'],
      preparationTime: now,
      expiryTime: new Date(now.getTime() + 18 * 60 * 60 * 1000),
      storageCondition: StorageCondition.ROOM_TEMPERATURE,
      pickupAddressId: supermarketUser.addresses[0].id,
      pickupStartTime: now,
      pickupEndTime: new Date(now.getTime() + 8 * 60 * 60 * 1000),
      contactPerson: 'Mr. Rajesh Verma',
      contactPhone: '+919876543202',
      status: DonationStatus.PUBLISHED,
      priority: PriorityLevel.NORMAL,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80' }
        ]
      }
    }
  });

  // 9. Emergency Food Request
  await prisma.foodRequest.create({
    data: {
      requesterId: ngoUser2.id,
      title: '🚨 Emergency Food Aid: 120 Nutritious Meals for Night Shelter',
      description: 'Urgent evening meal requirement for temporary flood relief shelter families and children.',
      category: FoodCategoryType.COOKED_MEALS,
      mealsRequired: 120,
      dietaryRequirements: [DietaryFlag.VEGETARIAN],
      targetLatitude: ngoUser2.addresses[0].latitude,
      targetLongitude: ngoUser2.addresses[0].longitude,
      targetAddress: 'Hope Shelter, 14 Lajpat Nagar IV, New Delhi',
      requiredBy: new Date(now.getTime() + 3 * 60 * 60 * 1000),
      priority: PriorityLevel.EMERGENCY,
      numberOfPeople: 120,
      fulfilledMeals: 0,
      isFulfilled: false
    }
  });

  // 10. Gamification Badges & Rewards
  await prisma.userBadge.createMany({
    data: [
      { userId: restaurantUser.id, badgeType: BadgeType.FIRST_DONATION },
      { userId: restaurantUser.id, badgeType: BadgeType.FOOD_SAVER },
      { userId: restaurantUser.id, badgeType: BadgeType.SUPER_DONOR },
      { userId: volunteerUser.id, badgeType: BadgeType.TOP_VOLUNTEER },
      { userId: volunteerUser.id, badgeType: BadgeType.EMERGENCY_HERO }
    ]
  });

  // 11. Certificate
  await prisma.certificate.create({
    data: {
      userId: restaurantUser.id,
      title: 'Certificate of Excellence in Food Rescue & Zero Waste',
      description: 'In recognition of rescuing over 4,800 meals and preventing 1.9 tons of organic landfill waste.',
      mealsRescued: 4800,
      kgRescued: 1440,
      certificateNo: 'CERT-FOODX-2026-00482'
    }
  });

  // 12. Fundraising Campaign
  await prisma.campaign.create({
    data: {
      title: 'Zero Hunger Delhi: Feed 50,000 School Children',
      description: 'Support community logistics, insulated electric delivery vans, and hot meals for children in municipal night schools.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      targetAmount: 500000,
      raisedAmount: 384000,
      donorCount: 412,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true
    }
  });

  // 13. Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: 'NGO_VERIFICATION_APPROVED',
      entity: 'NGOProfile',
      entityId: ngoUser1.ngoProfile!.id,
      metadata: { reason: 'FSSAI and 80G documentation verified by legal team' }
    }
  });

  console.log('✅ Seed completed successfully with 1 Admin, 2 Donors, 2 NGOs, 1 Volunteer, Deliveries, Live Chat, and Campaigns.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
