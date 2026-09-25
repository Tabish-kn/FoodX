# FoodX System Architecture

FoodX is built as a production-grade full-stack monorepo connecting Food Donors, Verified NGOs, Volunteer Logistics Couriers, Beneficiaries, and Platform Administrators.

```text
                  ┌─────────────────────────────────────────┐
                  │       PostgreSQL Relational DB          │
                  │  (30+ Prisma Models, GIS Lat/Lon, Enum) │
                  └────────────────────▲────────────────────┘
                                       │
                  ┌────────────────────┴────────────────────┐
                  │       FoodX REST & WebSocket API        │
                  │  (Express + TS, Socket.io, BullMQ Queue)│
                  └─────────▲─────────────────────▲─────────┘
                            │                     │
           ┌────────────────┴──────────┐   ┌──────┴────────────────────┐
           │     Next.js 14 Web App    │   │  Flutter Mobile & Web App │
           │ (App Router, Tailwind CSS,│   │(Material 3, Riverpod/Dio, │
           │     Admin Control Hub)    │   │ QR Scanner & Live Tracking│
           └───────────────────────────┘   └───────────────────────────┘
```

---

## Key Subsystems

### 1. AI / Smart Matching Engine

Calculates a weighted compatibility score between available food batches and registered NGO intake capacity:

- **Distance Score (35%)**: Proximity via Haversine calculation within service radius.
- **Urgency Score (25%)**: Prioritizes food expiring within 1–3 hours.
- **Quantity Fit (15%)**: Ensures portions match shelter intake size without oversupply.
- **Food Type (15%)**: Strict compliance with dietary preferences (Vegetarian, Vegan, Jain, Halal).
- **Volunteer Availability (10%)**: Readiness of nearby couriers.

### 2. Cryptographic Handshake (QR & OTP)

Prevents fake pickups and delivery fraud:

- **Pickup Verification**: Volunteer scans donor QR code and enters the donor's 6-digit OTP code before leaving the kitchen.
- **Delivery Verification**: NGO scans the drop-off QR code and submits the delivery OTP code upon arrival.

### 3. Dual Adapter Pattern

Enables full local development & offline demonstration without requiring 3rd-party API keys:

- **Maps**: Real Google Maps API or internal Haversine distance/ETA engine.
- **Notifications**: Live SMS/Email/FCM or simulated console log streams.
- **Payments**: Stripe/Razorpay or internal simulated checkout sessions with 80G tax receipt generation.

### 4. AI Multi-Stop Route Optimizer & Batching Engine

Optimizes courier itineraries across multiple pickup and drop-off waypoints:

- **Precedence Satisfaction**: Guarantees all pickup locations for a given donation are visited before its associated drop-off shelter.
- **Urgency Multipliers**: Prioritizes emergency-rated food rescue stops to minimize food spoilage risk.
- **Carbon & Cost Offsets**: Quantifies mileage saved, fuel cost reductions (₹), and cumulative CO₂ emission offsets (kg CO₂).
