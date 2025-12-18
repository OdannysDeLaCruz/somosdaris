# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SomosDaris is a cleaning service booking application built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Prisma ORM with PostgreSQL. Users can browse services, select hour packages, schedule appointments, and create reservations without login.

## Development Commands

### Running the Application
- `npm run dev` or `bun dev` - Start the development server at http://localhost:3000
- `npm run build` or `bun build` - Create an optimized production build
- `npm start` or `bun start` - Run the production build locally

### Code Quality
- `npm run lint` or `bun lint` - Run ESLint to check code quality

### Database Commands
- `bun run db:generate` - Generate Prisma Client
- `bun run db:push` - Push schema changes to database
- `bun run db:migrate` - Create and run migrations
- `bun run db:seed` - Seed database with initial data
- `bun run db:studio` - Open Prisma Studio GUI

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `page.tsx` - Home page showing available services
  - `servicios/[id]/reservar/` - Booking wizard with 3 steps
  - `confirmacion/` - Reservation confirmation page
  - `api/` - API routes for services, packages, addresses, reservations
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and Prisma client singleton
- `prisma/` - Database schema and seed file
- `public/` - Static assets

### Key Technologies
- **Next.js 16**: Uses App Router (not Pages Router)
- **React 19**: Latest React with React Server Components
- **TypeScript**: Strict mode enabled with ES2017 target
- **Tailwind CSS v4**: Using the new PostCSS plugin architecture (`@tailwindcss/postcss`)
- **Prisma ORM**: PostgreSQL database with 7 tables (Users, Addresses, Packages, Services, Reservations, Payments, Coupons)
- **React Hook Form + Zod**: Form handling and validation
- **react-day-picker**: Calendar component for date selection
- **date-fns**: Date formatting and manipulation
- **Bun**: Package manager and TypeScript runtime

### TypeScript Configuration
- Path alias: `@/*` maps to `./src/*`
- JSX mode: `react-jsx` (not `preserve`)
- Module resolution: `bundler`
- Strict mode enabled

### Styling Architecture
- Tailwind CSS v4 configured via PostCSS
- Dark mode support using `dark:` class variants
- Global styles in `src/app/globals.css`
- Font variables: `--font-geist-sans` and `--font-geist-mono`

## Important Conventions

### File Organization
- All application code lives in `src/app/` following App Router conventions
- Server Components by default (add `'use client'` directive for Client Components)
- Use TypeScript for all new files (`.tsx` for components, `.ts` for utilities)

### ESLint Configuration
- Uses Next.js ESLint config with TypeScript support
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Configuration in `eslint.config.mjs` using new ESLint flat config format

### Tailwind CSS v4
- Configuration is via PostCSS (`postcss.config.mjs`) not `tailwind.config.js`
- Uses `@tailwindcss/postcss` plugin
- Global imports in `src/app/globals.css`

## Application Flow

### Booking Process (3-step wizard)
1. **Step 1**: Select package (hours) and date/time
2. **Step 2**: Enter customer info (name, phone, email) and address
3. **Step 3**: Review summary and confirm reservation

### Database Schema
- **Users**: Customer information (name, lastname, phone, email)
- **Addresses**: Service locations linked to users
- **Packages**: Hour packages with pricing (2h, 4h, 6h, 8h)
- **Services**: Available services (currently: Limpieza)
- **Reservations**: Bookings linking users, services, packages, addresses
- **Payments**: Payment records (processed after service)
- **Coupons**: Discount codes

### API Routes
- `GET /api/services` - List all services
- `GET /api/services/[id]` - Get service details
- `GET /api/packages` - List hour packages
- `GET /api/users/[userId]/addresses` - List user addresses
- `POST /api/users/[userId]/addresses` - Create address
- `POST /api/reservations` - Create reservation (auto-creates user if needed)

### Key Components
- **PackageSelector**: Hour package selection cards
- **DateTimePicker**: Calendar + time selector (react-day-picker)
- **AddressForm**: Address input with validation
- **AddressList**: Display saved addresses
- **FixedFooter**: Sticky footer with total and continue button
- **ReservationSummary**: Final booking summary

## Environment Setup

1. Configure `.env.local` with PostgreSQL connection string
2. Run `bun run db:push` to create database tables
3. Run `bun run db:seed` to populate initial data
4. Start dev server with `bun dev`

## Next.js App Router Notes

- This project uses App Router, not Pages Router
- Components in `app/` are Server Components by default
- Client Components use `'use client'` directive
- API routes in `app/api/` return NextResponse
- Path alias `@/*` maps to `./src/*`
