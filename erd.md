# Velvet & Vine — Entity Relationship Diagram (ERD)

## Database Schema Overview
The database is structured to support a high-concurrency e-commerce environment with a focus on user roles and order fulfillment.

### 1. Entities

#### **User** (`users`)
- `id` (PK)
- `name`, `first_name`, `last_name`
- `email` (Unique)
- `phone`, `address`
- `role` (admin, rider, customer)
- `google_id`, `avatar` (For Social Auth)
- `password`, `remember_token`
- `timestamps`

#### **Product** (`products`)
- `id` (PK, String/UUID)
- `name`, `description`
- `price` (Decimal)
- `stock` (Integer)
- `image` (String, Path)
- `timestamps`

#### **Category** (`categories`)
- `id` (PK)
- `name` (Unique)
- `type` (e.g., Flowers, Tools)
- `timestamps`

#### **Order** (`orders`)
- `id` (PK)
- `user_id` (FK -> users.id, Nullable)
- `customer_name`, `customer_email`
- `total` (Decimal)
- `status` (Pending, In Arrangement, Out for Delivery, Delivered, Cancelled)
- `delivery_address`, `contact_phone`
- `delivery_option`, `payment_method`
- `maps_url` (For delivery)
- `picked_up_at`, `dropped_off_at`
- `timestamps`

#### **OrderItem** (`order_items`)
- `id` (PK)
- `order_id` (FK -> orders.id)
- `product_id` (FK -> products.id)
- `quantity` (Integer)
- `price` (Decimal, Snapshotted at time of order)
- `note`, `wrap` (Customization fields)

#### **Message** (`messages`)
- `id` (PK)
- `sender_id` (FK -> users.id)
- `receiver_id` (FK -> users.id)
- `message` (Text)
- `read_at` (Timestamp)
- `timestamps`

### 2. Relationships

- **User (1) <---> (N) Order**: A user can place multiple orders. Orders can also be placed by guests (null `user_id`).
- **Order (1) <---> (N) OrderItem**: An order consists of multiple line items.
- **Product (1) <---> (N) OrderItem**: A product can appear in many different order items.
- **Product (N) <---> (N) Category**: Products can belong to multiple categories, and categories contain many products (via `category_product` pivot table).
- **User (1) <---> (N) Message**: Users can be senders or receivers of many chat messages.
