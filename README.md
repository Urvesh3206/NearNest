<div align="center">
  <img src="https://api.dicebear.com/7.x/identicon/svg?seed=NeighbourHub&backgroundColor=059669" alt="NeighbourHub Logo" width="80" height="80" />
  <h1>🌟 NeighbourHub</h1>
  <p><strong>A Modern, Scalable Full-Stack Community & Neighborhood Operating Platform</strong></p>
  <p>Connecting Residents, Housing Societies, Nearby Businesses, Service Providers, and Local Authorities in One Secure Ecosystem.</p>

  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-monorepo-structure">Architecture</a> •
    <a href="#-license">License</a>
  </p>
</div>

---

## 🚀 Key Features

### 1. 🏠 Modern Landing & Onboarding
- **Airbnb & Apple Inspired UI**: Soft shadows, rounded geometry, glassmorphism, fluid typography, dark/light theme toggle.
- **Dynamic Bento Grid**: Interactive feature showcase, business discovery carousel, live infinite testimonials marquee, and interactive FAQ accordion.
- **Multi-Role Authentication**: Resident, Society Admin, Shop Owner, Service Provider, and Local Authority.

### 2. 📍 Real-Life Geolocation & Nearby Explorer
- **HTML5 Live GPS Detection**: One-touch GPS auto-detection with high precision.
- **OpenStreetMap Reverse Geocoding**: Automatically translates coordinates into real streets and neighborhoods.
- **Worldwide Place Search**: Live search for any city, street, or country worldwide.
- **Haversine Distance Calculator**: Exact straight-line mathematical distance calculations sorted from closest to farthest.
- **Interactive Leaflet Maps**: Visual map view with distinct color-coded markers for GPS location, nearby hotels, service providers, and local shops.

### 3. 🏨 Real-World Nearby Hotels & Stays
- **Live OpenStreetMap POI Integration**: Fetches real hotels, guest houses, and resorts near the user.
- **Room Reservation Flow**: Select room types (Deluxe King, Executive Suite, Standard Queen), check-in / check-out dates, and guest counts.
- **All Pricing in Indian Rupees (₹ / INR)**.

### 4. 🛠️ Verified Service Providers Directory
- **Certified Local Pros**: Electricians, Plumbers, Housekeepers/Maids, AC Techs, Tutors, Yoga Trainers, Carpenters, and Babysitters.
- **Verified Badges & Rates**: Experience tags, hourly/visit rates, customer reviews, and interactive **"Hire Now"** request dispatcher.

### 5. 🏪 Local Businesses & Appointments
- **Community Business Directory**: Bakeries, Cafes, Clinics, Gyms, Pharmacies, and Restaurants.
- **Interactive Booking**: Book tables or consultation visits with instant notifications.

### 6. 🏢 Housing Society Management Hub
- **Digital Notice Board**: Committee notices with urgency levels (Urgent, High, Normal).
- **Maintenance Billing**: Instant monthly breakdown (Maintenance, Water, Sinking fund) with simulated UPI / Card checkout and downloadable PDF receipts.
- **Digital Gate Pass & QR Code**: Generate entry passes for visitors with vehicle tracking.
- **Civic Complaints Tracker**: Ticket management (*Open, Assigned, In Progress, Resolved*).
- **Amenities Booking**: Clubhouse, Tennis Court, Swimming Pool, and Party Hall reservations.

### 7. 💬 Real-Time Chat & Direct Messaging
- Instant end-to-end simulated messaging with double blue checkmark read receipts, voice note UI, and attachment slots.

### 8. 🤖 "NeighbourBot" AI Concierge
- Smart community conversational assistant answering queries regarding local recommendations, notices, and society rules.

### 9. 🚨 Emergency SOS & Safety Center
- Big red animated countdown SOS alert, one-touch emergency dials (Police 100/911, Ambulance 108, Fire 101), Women Safety Mode, and live GPS sharing.

### 10. 📊 Platform & Society Admin Panel
- Real-time DAU stats, member verification approvals, complaints resolver, and broadcast SMS/Push notifications.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React Icons, React Hot Toast
- **Mapping & Geocoding**: Leaflet, OpenStreetMap Tiles & Nominatim Reverse Geocoding API
- **Backend**: Node.js, Express.js, Socket.io Realtime, Prisma ORM (v5), JSON Web Tokens (JWT), Helmet, CORS, Rate Limiting
- **Database**: PostgreSQL (760+ line schema supporting all models across all 6 user tiers)
- **Monorepo**: Turborepo + pnpm workspaces

---

## 📁 Monorepo Structure

```
c:/Final Project/
├── apps/
│   ├── web/                     # Next.js 14 Frontend Web Application
│   │   ├── src/
│   │   │   ├── app/             # App Router Pages & Layouts
│   │   │   │   ├── (auth)/      # Login, Signup, Forgot Password
│   │   │   │   ├── (dashboard)/ # Feed, Businesses, Services, Chat, Society, etc.
│   │   │   │   └── page.tsx     # Landing Page
│   │   │   ├── components/      # UI components & Landing sections
│   │   │   ├── lib/             # Geolocation, API, Firebase, Validators, Utilities
│   │   │   └── styles/          # Tailwind design tokens & global CSS
│   │   └── package.json
│   └── server/                  # Express.js REST API & Socket.io Backend
│       ├── prisma/              # Prisma schema (schema.prisma) & migrations
│       ├── src/                 # API controllers, routes, middleware, sockets
│       └── package.json
├── packages/
│   └── shared/                  # Shared TypeScript types, enums, and constants
├── turbo.json                   # Turborepo configuration
├── pnpm-workspace.yaml          # Monorepo workspaces
└── docker-compose.yml           # Local PostgreSQL & Redis container setup
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **pnpm**: v9.0.0 or higher (`npm i -g pnpm`)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/neighbourhub.git
   cd neighbourhub
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   - Copy `.env.example` to `.env` in the root and configure database credentials:
   ```bash
   cp .env.example .env
   ```

4. **Generate Prisma Client:**
   ```bash
   pnpm db:generate
   ```

5. **Start Development Servers:**
   ```bash
   pnpm dev
   ```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔒 Privacy & Security

- Complete Role-Based Access Control (RBAC) across 6 user tiers.
- Granular user privacy settings (hide phone, hide email, hide address, hide online status).
- Rate-limiting protection on sensitive authentication and payment endpoints.
- High-security HTTP headers configured with Helmet and CORS whitelist.

---

## 📄 License
This project is licensed under the MIT License.
