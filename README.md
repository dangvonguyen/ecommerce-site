# E-commerce Site

An e-commerce application built with Next.js, Drizzle ORM, and PostgreSQL.

## Features

- Admin dashboard with sales analytics
- Product management
- User management
- Order tracking

## Tech Stack

- **Framework**: Next.js 15
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your environment variables in `.env`
4. Generate and run database migrations:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## Database Schema

- **Users**: Customer information
- **Products**: Product catalog with pricing and availability
- **Orders**: Purchase records linking users and products
- **Download Verifications**: Secure download links for digital products

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
