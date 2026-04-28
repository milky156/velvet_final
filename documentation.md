# Velvet & Vine — Project Documentation

## Project Overview
**Velvet & Vine** is a premium floral boutique e-commerce platform. It provides a seamless experience for customers to browse flower bouquets, manage their carts, and place orders, while offering a powerful administrative suite for inventory management, order fulfillment, and customer support.

## Core Features

### 1. Storefront (Customer Experience)
- **Product Gallery**: High-end visual display of flower bouquets and floral tools.
- **Dynamic Cart**: Real-time cart management using a custom React context (`ShopContext`).
- **Checkout Flow**: Integrated checkout supporting delivery details, payment methods, and profile pre-filling.
- **Order Tracking**: Customers can view their order history and real-time status (Pending → Arrangement → Delivery).
- **Interactive Chat**: A floating chat widget allowing customers to message the admin directly.

### 2. Admin Dashboard (Management Suite)
- **Executive Overview**: Visual charts for revenue, sales growth, and inventory stock warnings.
- **Order Management**: Full control over order lifecycles, including confirmation and status updates.
- **Inventory Control**: Add, edit, and delete products with support for images and categories.
- **User Management**: A complete directory of registered users with the ability to manage roles (Admin, Rider, Customer) and view profile details (Phone, Address).
- **Communication Center**: A centralized chat interface to respond to customer inquiries in real-time.

### 3. Rider Dashboard
- **Delivery Management**: Dedicated interface for riders to pick up and drop off orders, with integrated map links.

## Technology Stack
- **Backend**: Laravel 11 (PHP)
- **Frontend**: React.js with Inertia.js (Single Page Application experience)
- **Styling**: Tailwind CSS with a custom Glassmorphic design system.
- **Database**: SQLite / MySQL (Eloquent ORM)
- **Authentication**: Laravel Breeze (Session-based) + Google OAuth Integration.

## Key Components
- **`AdminLayout`**: The foundation for all administrative pages, featuring a unified sidebar and premium aesthetics.
- **`ShopLayout`**: The customer-facing wrapper with a sticky navigation bar and cart integration.
- **`ShopContext`**: Manages the global state for the shopping cart and product filtering.

## Design Philosophy
The system follows a **Premium Boutique** aesthetic, utilizing:
- **Glassmorphism**: Soft blurs, subtle borders, and translucent cards.
- **Brand Palette**: A curated mix of `brand-50` to `brand-900` (Pinks and Deep Berries).
- **Modern Typography**: Bold, black headers and clean, legible body text.
