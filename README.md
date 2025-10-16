# Next.js 15 E-Commerce + Admin Dashboard (Full Stack)

A production-ready full stack e-commerce platform with an admin dashboard built with:
Next.js 15 (App Router), TypeScript, MongoDB/Mongoose, Clerk (auth & user management), Stripe (payments),
React-Hook-Form + Zod, Tailwind CSS + shadcn/ui, Next Cloudinary (image upload/storage), and Recharts.

## Features

### Storefront
- Browse collections and products
- Search, related products, product details
- Wishlist and cart flows
- Stripe Checkout → order creation via webhook
- Orders and Wishlist pages for users

### Admin Dashboard
- CRUD for collections, products, orders, customers
- Data tables with search and pagination
- Revenue analytics with Recharts

### Foundation
- Clerk auth, protected routes and server actions
- MongoDB with nested schemas and population
- React-Hook-Form + Zod for type-safe validation
- Next Cloudinary for uploads and transformations
- Tailwind + shadcn/ui for responsive, accessible UI
- TypeScript across models, APIs, server actions, components

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI: Tailwind CSS, shadcn/ui, Recharts
- Auth: Clerk
- Payments: Stripe (+ Webhooks)
- Forms: React-Hook-Form, Zod
- Database: MongoDB (Mongoose)
- Media: Next Cloudinary

## Screenshots / Demo (placeholders)

- Store: [styora-store.vercel.app](https://styora-store.vercel.app/)
- Admin: [styora-admin.vercel.app](https://styora-admin.vercel.app/)

Add images under `docs/screens/`:
- `./docs/screens/storefront.png`
- `./docs/screens/admin.png`

## Getting Started

### 1) Clone
```bash
git clone https://github.com/yourusername/next15-ecommerce.git
cd next15-ecommerce
