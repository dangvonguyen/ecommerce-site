# E-commerce Site

A e-commerce application for digital products built with Next.js, featuring Stripe payment integration, automated email notifications, and admin management.

## ✨ Features

### Customer Experience
- **Product Catalog**: Browse and view detailed product information
- **Digital Downloads**: Secure, time-limited download links for purchased products
- **Order History**: View past purchases and download links
- **Email Notifications**: Automated purchase receipts and order confirmations

### Admin Dashboard
- **Sales Analytics**: Real-time revenue, sales count, and customer metrics
- **Product Management**: Create, edit, delete, and manage product availability
- **Order Management**: View all orders with customer and product details
- **User Management**: Customer administration and account management

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe (checkout, webhooks, subscription)
- **Email**: Resend with React Email template
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn/ui (Radix primitives)

## 🚀 Getting Started

### Prerequisites

- Node.js and pnpm
- PostgreSQL database
- Stripe account (test/live keys)
- Resend account for emails

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Environment Setup
   Create `.env` and update environment variables with:
   ```bash
   cp .env.example .env
   ```
4. Database Setup
   ```bash
   pnpm drizzle-kit push
   ```
5. Start Development Server
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` for the storefront and `/admin` for the admin dashboard.

## 🗄 Database Schema

### Tables

- **Users**: Customer information and registration data
- **Products**: Product catalog with pricing, files, images, and availability
- **Orders**: Purchase records linking users and products
- **Download Verifications**: Time-limited, secure download tokens

### Key Relationships

- Users can have multiple orders (one-to-many)
- Products can be in multiple orders (one-to-many)
- Products have multiple download verification tokens (one-to-many)

## 📁 Project Structure

```
src/
├── app/
│   ├── (customerFacing)/          # Public storefront
│   │   ├── products/              # Product pages and purchase flow
│   │   ├── orders/                # Customer order history
│   │   └── payment/               # Payment success pages
│   ├── admin/                     # Admin dashboard
│   │   ├── products/              # Product management
│   │   ├── orders/                # Order management
│   │   └── users/                 # User management
│   └── webhook/                   # Stripe webhook handlers
├── components/                    # Reusable UI components
├── db/                            # Database schema and connection
├── email/                         # Email templates
└── lib/                           # Utility functions and helpers
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint with import ordering
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm email` - Start email template development server