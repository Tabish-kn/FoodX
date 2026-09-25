# FoodX REST API Documentation

Base URL: `http://localhost:4000/api/v1`

---

## 1. Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new Donor, NGO, Courier, or Beneficiary | No |
| `POST` | `/auth/login` | Email & password login, returns JWT access & refresh tokens | No |
| `POST` | `/auth/refresh` | Rotate expired access token using refresh token | No |
| `POST` | `/auth/logout` | Revoke active session | No |
| `POST` | `/auth/otp/send` | Request phone or email OTP for passwordless login | No |
| `GET` | `/auth/me` | Fetch active user session | Yes |

---

## 2. Food Donations Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/donations` | Publish a new food surplus batch with expiry time | Donor |
| `GET` | `/donations` | List available donations with filters & geo-sorting | No |
| `GET` | `/donations/:id` | Fetch donation details with images & verification tokens | No |
| `GET` | `/donations/:id/matches` | Run AI matching score for nearby NGOs | Yes |
| `POST` | `/donations/:id/accept` | NGO accepts available food donation | NGO |
| `POST` | `/donations/:id/cancel` | Cancel active donation listing | Donor |

---

## 3. Volunteer Logistics & Verification Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/deliveries/available` | Browse available courier delivery runs | Volunteer |
| `POST` | `/deliveries/:donationId/accept` | Claim a delivery task | Volunteer |
| `POST` | `/deliveries/verify-pickup` | Verify pickup via QR token & OTP | Volunteer |
| `POST` | `/deliveries/verify-delivery` | Verify drop-off completion via QR token & OTP | Any |
| `PATCH` | `/deliveries/:id/location` | Stream volunteer GPS coordinates | Volunteer |

---

## 4. Admin Governance & Reports

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | Platform-wide rescue metrics & environmental impact | Admin |
| `GET` | `/admin/users` | List all platform users | Admin |
| `PATCH` | `/admin/users/:id/verify` | Approve or reject NGO/Courier legal verification | Admin |
| `GET` | `/admin/audit-logs` | Immutable audit trails | Admin |

---

## 5. AI Smart Matching & Route Optimization

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/matching/optimize-route` | Multi-stop TSP route optimizer with precedence, ETAs, & CO2 stats | Volunteer / Any |
| `GET` | `/matching/donations/:id` | AI compatibility scoring between food batch and nearby NGOs | Yes |
