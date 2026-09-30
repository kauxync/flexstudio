# AGENTS.md — FlexStudio Project Documentation

## Project Overview

**FlexStudio** is a premium digital marketplace built with Next.js 16. Users can purchase web templates, source code, and hire development services.

**Live at:** `http://localhost:3000`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7.x with Neon adapter |
| Auth | NextAuth v5 (JWT, Google, GitHub, Credentials) |
| Icons | Lucide React |
| Fonts | Playfair Display (headings), DM Sans (body), JetBrains Mono (code) |
| Animations | CSS keyframes + IntersectionObserver |

---

## Design System

- **Colors:** Royal Violet (`#8b5cf6`) + Electric Indigo (`#6366f1`) on luminous soft lavender-slate (`#f8f9ff`)
- **Dark Mode:** Deep cosmic midnight (`#090714`) + Royal Obsidian card (`#110d24`) + Neon Amethyst (`#a855f7`) & Luminous Indigo (`#818cf8`)
- **Theme:** Stored in localStorage, inline script prevents flash on reload
- **Logo:** `public/logo.svg` (light) and `public/logo-dark.svg` (dark), auto-swapped

---

## Directory Structure

```
flexstudioo/
├── prisma/
│   ├── schema.prisma        # 13 models
│   └── seed.ts              # Seed script
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Design system
│   │   ├── (auth)/          # Login, Register
│   │   ├── (main)/          # Storefront pages (Navbar & Footer)
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── templates/   # Template marketplace + [slug] + [slug]/download
│   │   │   ├── source-code/ # Source code marketplace + [slug]
│   │   │   ├── services/    # Services
│   │   │   ├── pricing/     # Pricing
│   │   │   ├── search/      # Global search
│   │   │   ├── preview/[slug]/ # Live preview iframe
│   │   │   ├── dashboard/   # User: orders, downloads, settings
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── wishlist/    # Saved items
│   │   │   ├── checkout/    # Order placement
│   │   │   ├── payment-success/
│   │   │   ├── login, register, verify, etc.
│   │   │   └── test-credentials/
│   │   ├── admin/           # Separate Admin Portal (Dedicated shell & layout)
│   │   │   ├── layout.tsx   # AdminGuard + AdminLayoutShell
│   │   │   ├── page.tsx     # Executive Dashboard
│   │   │   ├── analytics/   # Analytics & Business Intelligence
│   │   │   ├── products/    # Product catalog + new + [slug]
│   │   │   ├── orders/      # Orders & Transactions ledger
│   │   │   ├── coupons/     # Promo discounts & limits
│   │   │   ├── reviews/     # Customer reviews moderation
│   │   │   ├── newsletter/  # Audience subscribers & CSV export
│   │   │   ├── users/       # Users & roles (super_admin)
│   │   │   └── settings/    # Platform & gateway configuration
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── admin/           # AdminSidebar, AdminHeader, CommandPalette, AdminGuard, AdminLayoutShell
│   │   ├── ui/              # Button, Card, Badge, Input, Modal, AnimatedSection, ThemeToggle
│   │   ├── layout/          # Navbar, Footer
│   │   ├── sections/        # Hero, Categories, Features, Services, Pricing, Testimonials, Newsletter, CTA
│   │   └── providers/       # SessionProvider
│   ├── lib/                 # prisma.ts, auth.ts, auth-edge.ts, utils.ts
│   ├── hooks/               # use-theme, use-scroll-animation, use-typing-effect
│   ├── config/site.ts       # Navigation, footer, categories
│   └── types/index.ts       # TypeScript interfaces
├── public/
│   ├── logo.svg             # Light theme logo
│   └── logo-dark.svg        # Dark theme logo
└── AGENTS.md                # This file
```

---

## Database Schema (13 Models)

**Auth:** User, Account, Session, VerificationToken
**Products:** Product (with zipUrl, demoUrl for downloads)
**Commerce:** Order, OrderItem, CartItem, WishlistItem
**Content:** BlogPost, Review, Newsletter

---

## API Routes (12 endpoints)

| Endpoint | Methods | Auth |
|----------|---------|------|
| `/api/auth/[...nextauth]` | GET, POST | Public |
| `/api/register` | POST | Public |
| `/api/products` | GET, POST | GET=Public, POST=Admin |
| `/api/products/[slug]` | GET, PATCH, DELETE | GET=Public, others=Admin |
| `/api/users` | GET, POST, PATCH, DELETE | Super Admin |
| `/api/reviews` | GET, POST | GET=Public, POST=Auth |
| `/api/cart` | GET, POST | Auth |
| `/api/cart/[id]` | PUT, DELETE | Auth |
| `/api/wishlist` | GET, POST | Auth |
| `/api/wishlist/[id]` | DELETE | Auth |
| `/api/orders` | GET, POST | Auth |
| `/api/search` | GET | Public |

---

## Pages (28+ routes)

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, features, services, pricing, testimonials, newsletter |
| `/templates` | Filterable grid with sidebar filters, load more |
| `/templates/[slug]` | Product detail with reviews, buy/download |
| `/templates/[slug]/download` | Download purchased products |
| `/source-code` | Source code marketplace |
| `/source-code/[slug]` | Source code detail |
| `/services` | Service cards with pricing |
| `/pricing` | Pricing tiers |
| `/search` | Global search across all content |
| `/preview/[slug]` | Live preview with device switcher |
| `/cart` | Shopping cart |
| `/wishlist` | Saved items |
| `/checkout` | Order placement |
| `/payment-success` | Order confirmation |
| `/dashboard` | User dashboard |
| `/dashboard/orders` | Order history |
| `/dashboard/downloads` | Purchased products |
| `/dashboard/settings` | Profile settings |
| `/admin` | Admin dashboard |
| `/admin/products` | Product management |
| `/admin/products/new` | Create product |
| `/admin/products/[slug]` | Edit product |
| `/admin/orders` | Order management |
| `/admin/users` | User management (super_admin) |
| `/login` | Email/password + OAuth |
| `/register` | New account |
| `/verify` | Email verification |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset form |
| `/setup` | OAuth setup guide |
| `/test-credentials` | Test card details |

---

## Authentication

**Providers:** Google, GitHub, Credentials (email/password)
**Roles:** user, admin, super_admin
**Auto-verification:** Users verified on first login
**Middleware:** Protects `/dashboard/*`, `/admin/*`, `/api/cart/*`, `/api/wishlist/*`, `/api/orders/*`

---

## Default Credentials

| Email | Password | Role |
|-------|----------|------|
| flexstudio@kauxync.in | admin123 | super_admin |
| admin@flexstudio.dev | admin123 | admin |
| demo@flexstudio.dev | demo123 | user |

---

## Commands

```bash
npm run dev              # Development server
npm run build            # Production build
npx prisma db push       # Sync schema to database
npx prisma generate      # Regenerate Prisma client
npx prisma db seed       # Seed database
npx tsx prisma/create-admin.ts <email> <role>  # Create/update admin
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth config (Google, GitHub, Credentials) |
| `src/lib/auth-edge.ts` | Edge-compatible auth (no Prisma) |
| `src/lib/prisma.ts` | Prisma client with Neon adapter |
| `src/lib/utils.ts` | cn() utility |
| `src/middleware.ts` | Route protection |
| `src/config/site.ts` | Navigation, footer, categories |
| `src/hooks/use-theme.ts` | Light/dark mode |
| `src/components/ui/animated-section.tsx` | Scroll animations |
| `prisma/schema.prisma` | Database schema |
| `prisma/create-admin.ts` | Admin user management |
