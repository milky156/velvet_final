export type UserRole = "customer" | "admin" | "rider" | null;
export type ProductCategory = "Occasion" | "FlowerType" | "Price";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categories: { id: number; name: string; type: string }[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  note?: string;
  wrap?: string;
};

export type OrderStatus = "In Arrangement" | "Out for Delivery" | "Delivered" | "Canceled" | "Returned";

export type Order = {
  id: string | number;
  items: CartItem[];
  total: number;
  createdAt: string;
  created_at?: string;
  status: string;
  deliveryAddress?: string;
  delivery_address?: string;
  deliveryLat?: number;
  delivery_lat?: number;
  deliveryLng?: number;
  delivery_lng?: number;
  contactPhone?: string;
  contact_phone?: string;
  deliveryOption?: string;
  delivery_option?: string;
  paymentMethod?: string;
  payment_method?: string;
  mapsUrl?: string;
  maps_url?: string;
  customerName?: string;
  customer_name?: string;
  customerEmail?: string;
  customer_email?: string;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type Message = {
  id: string;
  from: "customer" | "admin";
  text: string;
  createdAt: string;
};
