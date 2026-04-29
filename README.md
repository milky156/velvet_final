# 🌸 Velvet & Vine — Premium Floral Boutique

![Velvet & Vine Logo](https://illustrations.popsy.co/pink/flower-delivery.svg)

Welcome to **Velvet & Vine**, a high-end e-commerce platform designed for modern floral boutiques. This system combines a stunning customer-facing storefront with a powerful, glassmorphic administrative dashboard.

## ✨ Key Features

### 🛒 Customer Experience
*   **Premium Gallery**: Browse curated flower bouquets with a sleek, responsive UI.
*   **Smart Cart**: Real-time cart updates and secure checkout.
*   **Live Chat**: Direct messaging with store administrators for personalized support.
*   **Order Tracking**: Monitor your bouquet from arrangement to your doorstep.

### 👑 Administration Suite
*   **Insights Dashboard**: Track revenue, orders, and inventory stock via beautiful visual charts.
*   **Inventory Management**: Full control over products, categories, and stock levels.
*   **Order Fulfillment**: Streamlined workflow for confirming, arranging, and delivering orders.
*   **User Management**: Complete directory of customers and riders with role-based access control.

## 🛠️ Technology Stack
*   **Backend**: Laravel 11 (PHP)
*   **Frontend**: React + Inertia.js (SPA Architecture)
*   **Styling**: Vanilla CSS & Tailwind CSS (Custom Design System)
*   **Auth**: Laravel Breeze + Google OAuth
*   **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites
*   PHP 8.2+
*   Composer
*   Node.js & NPM
*   SQLite / MySQL

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd velvet---vine-system-main/laravel-app
    ```
2.  **Install dependencies**:
    ```bash
    composer install
    npm install
    ```
3.  **Environment Setup**:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
4.  **Database Migration**:
    ```bash
    php artisan migrate --seed
    ```
5.  **Run the application**:
    ```bash
    php artisan serve
    # In a separate terminal:
    npm run dev
    ```

## 📊 Database Architecture
For a detailed look at our data structure, please refer to:
*   [ERD Documentation](erd.md)
*   [System Documentation](documentation.md)

---
Developed with ❤️ by the Velvet & Vine Team.
# velvet_final
