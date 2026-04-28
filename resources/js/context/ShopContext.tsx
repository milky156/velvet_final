import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { products as initialProducts } from "@/lib/data";
import { Product, CartItem, Order, Profile, Message, UserRole } from "@/lib/types";

type ShopContextType = {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  profile: Profile;
  messages: Message[];
  lowStockAlert: string | null;
  currentUserRole: UserRole;
  username: string | null;
  upsertProduct: (product: Product) => void;
  addToCart: (productId: string, quantity: number, note?: string, wrap?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  updateCartItem: (productId: string, data: Partial<{ note: string; wrap: string }>) => void;
  updateProfile: (profile: Profile) => void;
  placeOrder: (
    deliveryAddress: string,
    contactPhone: string,
    deliveryOption: string,
    paymentMethod: string,
    deliveryLatLng?: { lat: number; lng: number } | null,
  ) => void;
  sendMessage: (text: string, from: "customer" | "admin") => void;
  advanceOrderStatus: (orderId: string | number) => void;
  setOrderStatus: (orderId: string | number, status: string) => void;
  signIn: (username: string, role: UserRole) => void;
  signOut: () => void;
  signUp: (username: string, role: UserRole) => void;
};

const defaultProfile: Profile = { name: "", email: "", phone: "", address: "" };

const ShopContext = createContext<ShopContextType>({} as ShopContextType);

export const ShopProvider = ({ children, dbProducts, dbOrders }: {
  children: React.ReactNode;
  dbProducts?: Product[];
  dbOrders?: Order[];
}) => {
  // Use DB products when available, fallback to local mock data
  const [products, setProducts] = useState<Product[]>(dbProducts ?? initialProducts);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("vv_cart") : null;
    return stored ? JSON.parse(stored) : [];
  });

  // Orders come from DB (passed as prop); local state only for admin/rider quick updates
  const [orders, setOrders] = useState<Order[]>(dbOrders ?? []);

  const [profile, setProfile] = useState<Profile>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("vv_profile") : null;
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("vv_messages") : null;
    return stored ? JSON.parse(stored) : [];
  });

  const [lowStockAlert, setLowStockAlert] = useState<string | null>(null);

  // Derive role from auth user passed by Inertia shared data
  const page = usePage<{ auth?: { user?: { id: number; name: string; email: string; role: string; email_verified_at?: string } } }>();
  const authUser = page.props?.auth?.user;
  const currentUserRole: UserRole = (authUser?.role as UserRole) ?? null;
  const username = authUser?.name ?? null;

  // Sync profile with authenticated user
  useEffect(() => {
    if (authUser) {
      setProfile((prev: Profile) => ({
        ...prev,
        name: authUser.name ?? prev.name,
        email: authUser.email ?? prev.email,
      }));
    }
  }, [authUser?.name, authUser?.email]);

  useEffect(() => { localStorage.setItem("vv_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("vv_profile", JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem("vv_messages", JSON.stringify(messages)); }, [messages]);

  const upsertProduct = useCallback((product: Product) => {
    setProducts((prev: Product[]) => {
      const idx = prev.findIndex((p: Product) => p.id === product.id);
      if (idx === -1) return [product, ...prev];
      return prev.map((p: Product) => (p.id === product.id ? product : p));
    });
  }, []);

  const addToCart = (productId: string, quantity: number, note?: string, wrap?: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (!product || product.stock < quantity) {
      setLowStockAlert("Sorry, not enough stock available.");
      return;
    }
    setCart((prev: CartItem[]) => {
      const existing = prev.find((item: CartItem) => item.productId === productId);
      if (existing) {
        return prev.map((item: CartItem) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, note, wrap }
            : item,
        );
      }
      return [...prev, { productId, quantity, note, wrap }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev: CartItem[]) => prev.filter((item: CartItem) => item.productId !== productId));
  };

  const updateProfile = (nextProfile: Profile) => setProfile(nextProfile);

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev: CartItem[]) => prev.map((item: CartItem) => item.productId === productId ? { ...item, quantity } : item));
  };

  const updateCartItem = (productId: string, data: Partial<{ note: string; wrap: string }>) => {
    setCart((prev: CartItem[]) =>
      prev.map((item: CartItem) =>
        item.productId === productId
          ? { ...item, note: data.note !== undefined ? data.note : item.note, wrap: data.wrap !== undefined ? data.wrap : item.wrap }
          : item,
      ),
    );
  };

  const placeOrder = (
    deliveryAddress: string,
    contactPhone: string,
    deliveryOption: string,
    paymentMethod: string,
    deliveryLatLng?: { lat: number; lng: number } | null,
  ) => {
    if (cart.length === 0) { setLowStockAlert("Cart is empty."); return; }

    router.post(
      "/checkout",
      {
        items: cart,
        deliveryAddress,
        contactPhone,
        deliveryOption,
        paymentMethod,
        deliveryLat: deliveryLatLng?.lat ?? null,
        deliveryLng: deliveryLatLng?.lng ?? null,
        customerName: profile.name || username || "Guest",
        customerEmail: profile.email || "guest@order.com",
      },
      {
        onSuccess: () => {
          setCart([]);
          setLowStockAlert("Order placed! Redirecting to your orders…");
        },
        onError: (errors: any) => {
          setLowStockAlert(Object.values(errors).join(" "));
        },
      },
    );
  };

  const sendMessage = (text: string, from: "customer" | "admin") => {
    const newMessage: Message = { id: `msg_${Date.now()}`, from, text, createdAt: new Date().toISOString() };
    setMessages((old: Message[]) => [...old, newMessage]);
    if (from === "customer") {
      setTimeout(() => {
        setMessages((old: Message[]) => [
          ...old,
          { id: `msg_${Date.now()}_r`, from: "admin", text: "Thanks for reaching out! Our team will get back to you shortly.", createdAt: new Date().toISOString() },
        ]);
      }, 1200);
    }
  };

  const advanceOrderStatus = (orderId: string | number) => {
    const order = orders.find((o: Order) => String(o.id) === String(orderId));
    if (!order) return;
    const current = order.status;
    const next = current === "In Arrangement" ? "Out for Delivery" : current === "Out for Delivery" ? "Delivered" : "Delivered";
    router.patch(`/admin/orders/${orderId}/status`, { status: next }, { preserveScroll: true });
    setOrders((old: Order[]) => old.map((o: Order) => String(o.id) === String(orderId) ? { ...o, status: next } : o));
  };

  const setOrderStatus = (orderId: string | number, status: string) => {
    router.patch(`/rider/orders/${orderId}/status`, { status }, { preserveScroll: true });
    setOrders((old: Order[]) => old.map((o: Order) => String(o.id) === String(orderId) ? { ...o, status } : o));
  };

  const signIn = (name: string, role: UserRole) => {};
  const signOut = () => { router.post("/logout"); };
  const signUp = (name: string, role: UserRole) => {};

  const value = useMemo(
    () => ({
      products, cart, orders, profile, messages, lowStockAlert,
      currentUserRole, username,
      upsertProduct, addToCart, removeFromCart, updateCartQty,
      updateCartItem, updateProfile, placeOrder, sendMessage,
      advanceOrderStatus, setOrderStatus, signIn, signOut, signUp,
    }),
    [products, cart, orders, profile, messages, lowStockAlert, currentUserRole, username, upsertProduct],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => useContext(ShopContext);
