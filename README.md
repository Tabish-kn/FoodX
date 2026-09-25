# 🍲 FoodX — Full-Stack Food Donation & Food Rescue Monorepo

![FoodX Banner](https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80)

> **Bridging Hunger with Surplus — Real-Time Food Rescue Network**  
> FoodX is a full-stack platform that connects Food Donors (Hotels, Restaurants, Supermarkets, Event Organizers), Verified NGOs, Volunteer Logistics Couriers, Beneficiaries, and Platform Administrators to prevent edible food waste and accelerate hunger relief.

---

## 🏗️ Architecture

FoodX is built as a unified TypeScript and Dart monorepo using npm workspaces:

```text
                  ┌─────────────────────────────────────────┐
                  │       PostgreSQL Relational DB          │
                  │  (30+ Prisma Models, GIS Lat/Lon, Enum) │
                  └────────────────────▲────────────────────┘
                                       │
                  ┌────────────────────┴────────────────────┐
                  │       FoodX REST & WebSocket API        │
                  │ (Express + TS, Socket.io, BullMQ Ready) │
                  └─────────▲─────────────────────▲─────────┘
                            │                     │
           ┌────────────────┴──────────┐   ┌──────┴────────────────────┐
           │     Next.js 14 Web App    │   │  Flutter Mobile & Web App │
           │ (App Router, Tailwind CSS,│   │(Material 3, Riverpod/Dio, │
           │     Admin Control Hub)    │   │ QR Scanner & Live Tracking│
           └───────────────────────────┘   └───────────────────────────┘
```

- **Frontend Web & Admin**: Next.js 14 with App Router, React 18, Tailwind CSS, Lucide icons, and Recharts.
- **Cross-Platform Mobile**: Flutter 3.x / Dart application supporting Android, iOS, and Web with Material 3 and Riverpod.
- **Backend API & Real-Time**: Node.js Express server with Socket.io WebSockets for live courier GPS tracking and mission coordination chat.
- **Database Layer**: PostgreSQL managed via Prisma ORM with 30+ normalized models and GIS coordinate indexing.
- **Shared Core Packages**: Centralized TypeScript packages for shared DTO interfaces (`@foodx/shared-types`), Zod validation schemas (`@foodx/validation`), and algorithm configuration weights (`@foodx/config`).
- **Dual Adapter Pattern**: Pluggable 3rd-party integrations (Maps, SMS, Push notifications, and Payment gateways) with simulated offline fallbacks for zero-dependency local development.

---

## 🚀 Key Features

### 1. Surplus Donation Publishing & Expiry Countdown

- Donors post surplus food with portion counts, preparation timestamps, expiry timers, dietary tags (Vegetarian, Vegan, Jain, Halal), and storage requirements.
- Real-time expiry state machine escalates batches expiring in under 1 hour to `EMERGENCY` priority.

### 2. AI Smart Matching Engine

- Multi-factor compatibility scoring algorithm evaluating distance proximity (Haversine), urgency, NGO intake capacity, and dietary preferences.

### 3. AI Multi-Stop Route Optimizer & Rescue Batching

- Volunteer couriers can batch multiple nearby surplus food runs into a single circuit.
- Uses Nearest Neighbor and 2-Opt local search heuristics while enforcing precedence constraints (pickups strictly precede drop-offs).
- Automatically calculates distance saved (km), fuel cost savings (₹), and carbon emission reductions (kg CO₂).

### 4. Dual-QR & OTP Handshake Verification

- **Pickup Handshake**: Courier scans donor QR code and submits the donor's 6-digit OTP code before departing.
- **Drop-off Handshake**: Shelter staff scans courier drop-off QR code and verifies final OTP upon handover.

### 5. Live GPS Tracking & Mission Chat

- Real-time vector map tracking courier vehicle movement, polyline routes, dynamic ETAs, and integrated Socket.io mission chat.

### 6. Corporate Social Responsibility (CSR) Certificates & Gamification

- Automatic issuance of audited landfill diversion certificates for donor tax deductions.
- Courier and donor leaderboards with badge milestones (`FIRST_DONATION`, `COMMUNITY_HERO`, `ZERO_WASTE_CHAMPION`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo & Build** | npm Workspaces, TypeScript 5.3, ts-node, ts-node-dev |
| **Web Application** | Next.js 14.1, React 18.2, Tailwind CSS 3.4, Recharts 2.12, Lucide React |
| **Mobile Application** | Flutter 3.x, Dart 2.19+, Flutter Riverpod 2.3, GoRouter 7.1, Dio 5.1, Google Fonts |
| **Backend REST & WS** | Node.js 20.x, Express 4.18, Socket.io 4.7, Zod 3.22, Bcrypt.js, JsonWebToken |
| **Database & ORM** | PostgreSQL 15+, Prisma ORM 5.10 / 5.22 |
| **Testing** | Node.js Test Runner, TypeScript Test Suite, Flutter Test, Flutter Analyze |
| **Containerization** | Docker, Docker Compose (PostgreSQL, Redis, API, Web) |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`) |

---

## 📁 Project Structure

```text
FoodX/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI build, test & analysis pipeline
├── apps/
│   ├── api/                     # Express & Socket.io Backend Server
│   │   └── src/
│   │       ├── adapters/        # Dual Adapter Pattern (Maps, Notifications, Payments)
│   │       ├── admin/           # Super Admin metrics & audit endpoints
│   │       ├── auth/            # JWT authentication & session management
│   │       ├── chat/            # Socket.io live mission chat gateway
│   │       ├── common/          # Middleware, guards & standardized responses
│   │       ├── complaints/      # Dispute management & resolution
│   │       ├── config/          # Environment variable parser & config schema
│   │       ├── db/              # Prisma database client instance
│   │       ├── deliveries/      # Courier assignment & QR/OTP logistics
│   │       ├── donations/       # Surplus food batch CRUD & listing
│   │       ├── matching/        # AI matching engine & Multi-Stop Route Optimizer
│   │       ├── notifications/   # Push, SMS, and Email dispatcher
│   │       ├── payments/        # Campaign donations & simulated checkouts
│   │       ├── requests/        # Beneficiary & NGO food aid requests
│   │       ├── rewards/         # Gamification points & badge system
│   │       ├── tracking/        # Live GPS location WebSocket gateway
│   │       ├── users/           # User & organization profiles
│   │       ├── main.ts          # Server entry point
│   │       └── test-runner.ts   # Core business logic test suite
│   ├── mobile/                  # Flutter Cross-Platform Mobile & Web App
│   │   ├── lib/
│   │   │   ├── core/theme/      # Material 3 color schemes & typography
│   │   │   ├── features/        # Feature screens (Donor, Home, Tracking, Volunteer)
│   │   │   └── main.dart        # Flutter entry point & GoRouter configuration
│   │   └── pubspec.yaml         # Flutter dependencies & metadata
│   └── web/                     # Next.js 14 Web & Admin Application
│       ├── app/                 # App Router pages (Donor, NGO, Volunteer, Admin, Tracking)
│       └── lib/                 # Auth context, API client, and utilities
├── packages/
│   ├── config/                  # Matching weights, urgency thresholds, & badge rules
│   ├── shared-types/            # Canonical TypeScript DTOs and Enums
│   └── validation/              # Zod validation schemas for all platform workflows
├── prisma/
│   ├── schema.prisma            # 30+ Normalized relational Prisma models
│   └── seed.ts                  # Comprehensive realistic demo dataset
├── docker/                      # Dockerfiles for API and Web
├── docs/                        # Architecture and API documentation guides
├── .env.example                 # Environment variables template
├── .gitattributes               # Cross-platform line ending normalization
├── .gitignore                   # Comprehensive exclusion rules
├── docker-compose.yml           # Orchestration for PostgreSQL, Redis, API, and Web
├── LICENSE                      # MIT Open Source License
├── package.json                 # Monorepo root configuration
└── tsconfig.base.json           # Shared TypeScript base configuration
```

---

## 🔐 Authentication & Authorization

- **JWT Token Pair**: Access tokens (15m expiry) and rotating refresh tokens (7d expiry).
- **Passwordless OTP**: 6-digit phone and email OTP authentication for rapid emergency aid access.
- **Role-Based Access Control (RBAC)**: Supported roles defined in `@foodx/shared-types`:
  - `SUPER_ADMIN`, `ADMIN`: Full platform governance, approval queues, audit trails.
  - `DONOR`, `HOTEL`, `RESTAURANT`, `SUPERMARKET`, `EVENT_ORGANIZER`: Publish surplus food, track pickups, download CSR certificates.
  - `NGO`, `COMMUNITY_KITCHEN`: Browse surplus, claim donations, broadcast emergency food requests.
  - `VOLUNTEER`: Accept delivery tasks, multi-stop route optimization, GPS broadcast, QR verification.
  - `BENEFICIARY`: Request confidential meals, locate community kitchens.

---

## ⚙️ Environment Variables

Create a `.env` file at the root of the project using the template provided in `.env.example`:

```bash
# Server & Environment Mode
NODE_ENV=development
PORT=4000
DEMO_MODE=true

# Database (PostgreSQL)
DATABASE_URL="postgresql://foodx_user:foodx_secret@localhost:5432/foodx_db?schema=public"

# Redis Cache & Queue
REDIS_URL="redis://localhost:6379"

# JWT Authentication Secrets
JWT_SECRET="foodx-jwt-super-secret-key-development-32chars-min"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="foodx-jwt-refresh-super-secret-key-32chars-min"
JWT_REFRESH_EXPIRES_IN="7d"

# Web Client URL & API URL
API_URL="http://localhost:4000"
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_WS_URL="ws://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Third-Party Integrations (Simulated mock fallbacks active if keys are omitted)
GOOGLE_MAPS_API_KEY=""
FIREBASE_PROJECT_ID=""
CLOUDINARY_CLOUD_NAME=""
STRIPE_SECRET_KEY=""
TWILIO_ACCOUNT_SID=""
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
```

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js**: `>= 18.x` (Recommended: Node 20 LTS)
- **Package Manager**: `npm` `>= 9.x`
- **Database**: PostgreSQL 15+ & Redis 7+ (or use Docker Compose)
- **Flutter SDK**: `>= 3.7.x` (for mobile development)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/FoodX.git
cd FoodX

# Install all monorepo dependencies
npm install

# Build shared packages (@foodx/shared-types, @foodx/validation, @foodx/config)
npm run build:packages
```

### 3. Database Setup & Seeding

```bash
# Generate Prisma Client & push schema to database
npm run db:generate
npm run db:push

# Seed database with realistic demo accounts & active deliveries
npm run db:seed
```

### 4. Running the Applications

#### Start the Backend Server & WebSockets

```bash
# Starts backend server & WebSocket gateways on http://localhost:4000
npm run dev:api
```

#### Start the Next.js Web & Admin Portal

```bash
# Starts web application on http://localhost:3000
npm run dev:web
```

#### Run the Flutter Frontend

##### Running on Web & Desktop

```bash
# In the mobile app directory
cd apps/mobile
flutter pub get
flutter run -d chrome     # Web browser
flutter run -d windows    # Windows Desktop
flutter run -d macos      # macOS Desktop
```

##### Running on Mobile (Android & iOS)

Check connected devices & emulators:

```bash
flutter devices
```

**Android (Emulator or Physical Device via USB):**

```bash
cd apps/mobile
flutter run -d android
```

> [!TIP]
> **Android Network & Backend Connection:**
>
> - **Using ADB Reverse (Recommended):** Run `adb reverse tcp:4000 tcp:4000` in your terminal. The app can then access the backend at `http://localhost:4000/api/v1` without modifying any code!
> - **Android Emulator Default Alias:** Alternatively, configure the API base URL in the app to `http://10.0.2.2:4000/api/v1`.
> - **Physical Device (Wi-Fi):** Set the API base URL to your computer's local LAN IP (e.g., `http://192.168.1.100:4000/api/v1`) and make sure both device and computer are connected to the same Wi-Fi network.

**iOS (Simulator or Physical Device):**

```bash
# For iOS Simulator (macOS)
open -a Simulator
cd apps/mobile
flutter run -d ios
```

> [!NOTE]
> The iOS Simulator can access `http://localhost:4000/api/v1` directly. For physical iPhones, use your machine's local LAN IP (e.g., `http://192.168.x.x:4000/api/v1`).

### 5. Production Build

```bash
# Build shared packages
npm run build:packages

# Build backend API
npm run build:api

# Build Next.js web application
npm run build:web
```

---

## 🧪 Testing & Quality Verification

```bash
# 1. Typecheck the entire monorepo (packages, API, and Web)
npm run typecheck

# 2. Run backend business logic, matching & route optimizer tests
npm run test:api

# 3. Run Flutter mobile static analysis
cd apps/mobile && flutter analyze
```

---

## 🐳 Deploy with Docker

To deploy and launch the full stack (PostgreSQL, Redis, API, and Web) with Docker:

```bash
# Start all containers in background with build
docker-compose up -d --build

# View real-time container logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

---

## 📡 API Reference

Base URL: `http://localhost:4000/api/v1`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new Donor, NGO, Courier, or Beneficiary | No |
| `POST` | `/auth/login` | Email & password login, returns JWT tokens | No |
| `POST` | `/auth/otp/send` | Request 6-digit phone or email OTP | No |
| `GET` | `/auth/me` | Fetch active user session profile | Yes |
| `POST` | `/donations` | Publish surplus food batch with expiry window | Donor |
| `GET` | `/donations` | List available donations with geo-filtering | No |
| `GET` | `/donations/:id` | Fetch donation details & verification tokens | No |
| `POST` | `/donations/:id/accept` | NGO accepts available food donation | NGO |
| `GET` | `/deliveries/available` | Browse available courier delivery runs | Volunteer |
| `POST` | `/deliveries/:id/accept` | Claim a delivery task | Volunteer |
| `POST` | `/deliveries/verify-pickup` | Verify pickup via QR token & OTP | Volunteer |
| `POST` | `/deliveries/verify-delivery` | Verify drop-off completion via QR token & OTP | Any |
| `POST` | `/matching/optimize-route` | Multi-stop TSP route optimizer with precedence | Volunteer / Any |
| `GET` | `/matching/donations/:id` | AI compatibility scoring for active donation | Yes |
| `GET` | `/admin/stats` | Platform-wide rescue metrics & environmental impact | Admin |
| `GET` | `/admin/audit-logs` | Immutable audit trails | Admin |

Detailed REST documentation is available in [docs/api.md](file:///a:/Sem%202/files/FoodX/docs/api.md).

---

## 🔑 Demo Accounts & Pre-Seeded Profiles

| Role | Demo Email | Password | Pre-Seeded Data |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@foodx.org` | `Password123!` | System analytics, NGO verification, audit logs |
| **Hotel Donor** | `chef@tajpalace.com` | `Password123!` | Active surplus listings, CSR landfill tax certificates |
| **Supermarket** | `manager@freshmart.in` | `Password123!` | Bakery & produce listings, leaderboard standing |
| **NGO Shelter** | `director@annafoundation.org` | `Password123!` | Claimed donations, broadcast food requests |
| **Volunteer Courier** | `alex.volunteer@gmail.com` | `Password123!` | In-transit mission, multi-stop route optimizer |
| **Beneficiary** | `beneficiary@foodx.org` | `Password123!` | Community kitchen aid finder |

---

## 🔄 CI/CD

Continuous Integration is configured via GitHub Actions in [.github/workflows/ci.yml](file:///a:/Sem%202/files/FoodX/.github/workflows/ci.yml):

- Triggers on `push` and `pull_request` to `main`, `master`, and `develop` branches.
- Sets up Node.js 20.x and Flutter 3.x environments.
- Executes dependency installation, shared package builds, Prisma generation, TypeScript type checking (`npm run typecheck`), API core test runner (`npm run test:api`), and Flutter static analysis (`flutter analyze`).

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Ensure all tests and type checks pass (`npm run typecheck && npm run test:api`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](file:///a:/Sem%202/files/FoodX/LICENSE) file for details.

---

## 🛡️ Security

- Real secrets must never be committed to source control. Use `.env` files locally (which are ignored by `.gitignore`).
- For reporting security vulnerabilities, please contact `security@foodx.org`.
