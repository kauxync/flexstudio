# FlexStudio — Premium Digital Marketplace & Freelance Platform

<div align="center">

![FlexStudio Banner](public/og-image.png)

**A high-performance digital marketplace built with Next.js 16 (App Router, Turbopack), Tailwind CSS v4, Prisma 7, PostgreSQL (Neon), and NextAuth v5.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Neon-PostgreSQL-00E599?logo=postgresql&logoColor=white)](https://neon.tech/)

</div>

---

## 🌟 Highlights & Key Features

- 🛍️ **Digital Marketplace**: Sell ready-to-use web templates and full-stack source code packages.
- 💼 **Freelancing & Custom Services**: Dedicated services catalog for hiring developers, custom web apps, and bespoke UI kits.
- ✉️ **Hostinger SMTP Contact Engine**: Inquiries dispatched via `mailer.flexstudio@kauxync.in` directly to `flexstudio@kauxync.in` with automatic branded receipt confirmation to clients.
- 📱 **Interactive Live Preview**: Device-responsive iframe preview (Desktop, Tablet, Mobile) with fullscreen toggle.
- ⚡ **Zero-Flash Theme Engine**: Royal Violet & Electric Indigo on luminous slate (Light Mode) and Cosmic Midnight with Neon Amethyst (Dark Mode) with zero layout shift or hydration flicker.
- 🎨 **Adaptive Branding**: Dual-variant logo icons (`/logo-icon-light.png` & `/logo-icon-dark.png`) auto-switched by theme.
- 💳 **Checkout & Payment Integration**: Seamless checkout flow integrated with Cashfree payment gateway (sandbox & production ready).
- 🛡️ **Multi-Role Authentication**: NextAuth v5 supporting Credentials, Google OAuth, and GitHub OAuth with role-based access (`user`, `admin`, `super_admin`).
- 📊 **Executive Admin Console**:
  - Live revenue metrics, transactions ledger, and order management
  - Complete product catalog management (create, edit, delete, toggle featured)
  - Discount coupons management with usage limits and expiry dates
  - Customer review moderation and audience newsletter subscribers export
  - Role management and platform settings
- 🔍 **Global Instant Search**: Search across templates, source code, tags, and categories.
- 🏷️ **Comprehensive SEO**: Dynamic JSON-LD structured data (Organization, Website, Product schema), OpenGraph tags, sitemap, and robots.txt.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, Clash Display & DM Sans typography |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Prisma 7.x with Neon serverless adapter |
| **Authentication** | NextAuth v5 (Auth.js) — Credentials, Google, GitHub |
| **Mailer** | Nodemailer with Hostinger SMTP (`smtp.hostinger.com`) |
| **Payments** | Cashfree Gateway API |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
flexstudio/
├── prisma/
│   ├── schema.prisma        # 13 relational models (Auth, Commerce, Products, Reviews)
│   └── seed.ts              # Database seed script with rich catalog
├── public/                  # Static assets (logos, icons, previews)
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages (Login, Register, Reset)
│   │   ├── (main)/          # Customer storefront & pages
│   │   │   ├── templates/   # Templates marketplace & detail
│   │   │   ├── source-code/ # Source code catalog & downloads
│   │   │   ├── services/    # Freelancer & agency web services
│   │   │   ├── pricing/     # Pricing tiers & packages
│   │   │   ├── contact/     # Contact & project inquiry desk
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── checkout/    # Checkout & payment processing
│   │   │   ├── dashboard/   # Customer portal (orders, downloads, settings)
│   │   │   └── preview/     # Responsive live preview iframe
│   │   ├── admin/           # Executive Admin Suite
│   │   │   ├── analytics/   # Business intelligence
│   │   │   ├── products/    # Product catalog manager
│   │   │   ├── orders/      # Orders & transactions ledger
│   │   │   ├── coupons/     # Promo codes & limits
│   │   │   ├── reviews/     # Review moderation
│   │   │   ├── newsletter/  # Subscriber audience manager
│   │   │   ├── users/       # User accounts & role access
│   │   │   └── settings/    # Platform settings
│   │   └── api/             # RESTful API endpoints (/api/contact, /api/auth, etc.)
│   ├── components/
│   │   ├── admin/           # Admin shell, sidebar, header, command palette
│   │   ├── layout/          # Storefront Navbar & Footer
│   │   ├── ui/              # Button, Modal, Card, Badge, LogoIcon, ThemeToggle
│   │   └── sections/        # Homepage hero, categories, services, testimonials
│   ├── config/              # Site configuration & navigation links
│   ├── hooks/               # Custom hooks (useTheme, animations)
│   └── lib/                 # Prisma client, mailer, NextAuth configuration, SEO utilities
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18.18 or higher (v20+ recommended)
- [PostgreSQL](https://neon.tech/) database URL (e.g. free Neon account)
- [Hostinger Email](https://hostinger.com) (for contact form email delivery)

### 2. Clone the Repository

```bash
git clone https://github.com/kauxync/flexstudio.git
cd flexstudio
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and configure your variables:

```env
# Database
DATABASE_URL="postgresql://username:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cashfree (Optional for test purchases)
CASHFREE_APP_ID="your_cashfree_app_id"
CASHFREE_SECRET_KEY="your_cashfree_secret_key"
CASHFREE_ENV="sandbox"
NEXT_PUBLIC_CASHFREE_MODE="sandbox"
```

### 5. Setup the Database

Push the schema to your database and seed initial products and admin accounts:

```bash
# Push database schema
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed initial catalog data & default accounts
npm run db:seed
```

### 6. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🔑 Demo Credentials

Once seeded, you can sign in with the following default accounts:

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `flexstudio@kauxync.in` | `admin123` |
| **Admin (Alias)** | `admin@flexstudio.dev` | `admin123` |
| **Customer** | `demo@flexstudio.dev` | `demo123` |

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Compile optimized production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint code checks |
| `npm run db:push` | Sync Prisma schema with database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Seed database with sample products & users |
| `npm run db:reset` | Reset database and re-seed |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
