# Changelog

All notable changes to the Velvet & Vine project.

---

## [1.0.0] — 2026-04-28

### 🏗️ Architecture
- **Migrated** from Next.js (App Router) to **Laravel 12 + Inertia.js + React**
- **Database** — Moved from localStorage to persistent SQLite with Eloquent ORM
- **Authentication** — Implemented Laravel Breeze with role-based access (customer/admin/rider)

### ✨ Added

#### Admin Panel
- **Dashboard** (`/admin`) — Revenue stats, hourly sales chart, monthly revenue bars, device traffic donut, best sellers, inventory stock warnings, admin chat
- **Products CRUD** (`/admin/products`) — Create, edit, delete products with category tagging, stock indicators, image URLs
- **Categories CRUD** (`/admin/categories`) — Manage categories with type classification and product count
- **Orders Management** (`/admin/orders`) — Status filter cards, search, status dropdown, expandable order detail rows with item list
- **Users Management** (`/admin/users`) — Role filter tabs, inline role change, avatar initials, search, delete
- **Delivery Zones** (`/admin/delivery`) — Zone CRUD with fee, coverage area, estimated time, active/inactive toggle

#### Authentication
- **Google OAuth** — "Continue with Google" via Laravel Socialite
- **EnsureUserIsAdmin** middleware — Blocks non-admin users from `/admin/*`
- **Admin auto-redirect** — Admin users are redirected to `/admin` after login

#### Backend
- 20 admin API routes with full CRUD
- Flash message sharing via Inertia middleware
- Delivery zones table with `name`, `area`, `fee`, `estimated_time`, `is_active` columns
- Database seeder with admin, rider, customer accounts + 4 products + 5 categories

#### Frontend
- AdminLayout with sidebar icons, user info, mobile hamburger menu
- Reusable Modal and ConfirmModal components
- All admin pages follow rose/pink brand theme with fade-in animations
- Responsive design across all viewports

### 🔄 Changed
- AdminController expanded from 2 methods to 18 methods
- User model now includes `role`, `phone`, `address` in fillable
- DeliveryZone model now has `fillable` and `casts` for all columns
- HandleInertiaRequests middleware shares flash success/error messages
- Dashboard now uses real DB props instead of ShopContext

### 🗃️ Database
- `users` — role, phone, address, google_id, avatar columns
- `products` — string primary key, name, description, price, stock, image
- `categories` — name, type with many-to-many pivot to products
- `orders` — full delivery tracking with lat/lng, maps URL, payment method
- `order_items` — quantity, note, wrap with product relationship
- `delivery_zones` — name, area, fee, estimated_time, is_active

---

## [0.1.0] — 2026-04-22

### Initial Release
- Next.js App Router with TypeScript
- Product catalog with category filtering
- Shopping cart with localStorage persistence
- Guest order placement
- Order tracking statuses
- Admin panel stub with basic reports
- Pink/white boutique theme
