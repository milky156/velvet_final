import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Link } from "@inertiajs/react";
import ShopLayout from "@/Layouts/ShopLayout";
import BackButton from "@/Components/BackButton";

function tryParseLatLng(input) {
  const s = input.trim();
  if (!s) return null;

  const direct = s.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (direct) {
    const lat = Number(direct[1]);
    const lng = Number(direct[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }

  const at = s.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) {
    const lat = Number(at[1]);
    const lng = Number(at[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }

  const q = s.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (q) {
    const lat = Number(q[1]);
    const lng = Number(q[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }

  return null;
}

export default function CartPage() {
  const { cart, products, removeFromCart, updateCartQty, updateCartItem, placeOrder } = useShop();
  const [showDelivery, setShowDelivery] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mapInput, setMapInput] = useState("");
  const [deliveryLatLng, setDeliveryLatLng] = useState(null);

  const cartDetails = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { item, product };
  });

  const cartTotal = cartDetails.reduce((total, entry) => {
    if (!entry.product) return total;
    return total + entry.product.price * entry.item.quantity;
  }, 0);

  const totalItems = cartDetails.reduce((sum, entry) => sum + entry.item.quantity, 0);

  return (
      <section className="mx-auto max-w-6xl px-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-brand-900">Shopping Cart</h1>
            <BackButton />
        </div>
        
        {cartDetails.length === 0 ? (
          <div className="glass p-12 text-center rounded-3xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </div>
            <p className="text-brand-400 font-bold text-xl mb-6">Your cart is empty.</p>
            <Link href="/home" className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all">
                Explore Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartDetails.map((entry) => (
              <article key={entry.item.productId} className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
                <div className="mb-3 grid gap-3 sm:grid-cols-3">
                  <div className="relative h-24 w-full overflow-hidden rounded-xl border border-pink-100">
                    <img
                      src={entry.product?.image ?? "/bouquet1.jpg"}
                      alt={entry.product?.name ?? "Bouquet"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <h2 className="text-lg font-bold text-pink-700">{entry.product?.name}</h2>
                    <p className="text-sm text-pink-600">${entry.product?.price.toFixed(2)}</p>
                    <p className="text-sm text-pink-600">Subtotal: ${(entry.product?.price ?? 0) * entry.item.quantity}</p>
                  </div>
                  <div className="sm:col-span-1">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full border border-pink-300 px-2 py-1 text-pink-700"
                        onClick={() => updateCartQty(entry.item.productId, Math.max(1, entry.item.quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={entry.item.quantity}
                        min={1}
                        onChange={(e) => updateCartQty(entry.item.productId, Number(e.target.value))}
                        className="w-16 rounded-lg border border-pink-300 px-2 py-1 text-center text-pink-700"
                      />
                      <button
                        className="rounded-full border border-pink-300 px-2 py-1 text-pink-700"
                        onClick={() => updateCartQty(entry.item.productId, entry.item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-2 grid gap-2">
                      <input
                        value={entry.item.wrap ?? ""}
                        onChange={(e) => updateCartItem(entry.item.productId, { wrap: e.target.value })}
                        placeholder="Wrap style"
                        className="rounded-lg border border-pink-300 px-3 py-2"
                      />
                      <input
                        value={entry.item.note ?? ""}
                        onChange={(e) => updateCartItem(entry.item.productId, { note: e.target.value })}
                        placeholder="Card note"
                        className="rounded-lg border border-pink-300 px-3 py-2"
                      />
                    </div>
                    <button
                      className="mt-3 rounded-full bg-red-100 px-3 py-1 text-sm text-red-600"
                      onClick={() => removeFromCart(entry.item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <article className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
              <h2 className="text-xl font-bold text-pink-700">Order Summary</h2>
              <p className="mt-2 text-base text-pink-700">Total Items: {totalItems}</p>
              <p className="text-2xl font-bold text-pink-800">Total: ${cartTotal.toFixed(2)}</p>

              {!showDelivery ? (
                <div className="mt-4">
                  <button
                    className="rounded-full bg-pink-700 px-5 py-2 text-white hover:bg-pink-800"
                    onClick={() => setShowDelivery(true)}
                  >
                    Finalize Order
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-pink-600">Delivery Address</span>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-pink-300 px-3 py-2"
                        placeholder="123 Main St, City"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-pink-600">Contact Phone</span>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-pink-300 px-3 py-2"
                        placeholder="(555) 123-4567"
                      />
                    </label>
                  </div>

                  <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-pink-700">Delivery Pin (Google Maps)</p>
                        <p className="mt-1 text-xs text-pink-600">
                          Paste a Google Maps link or enter <span className="font-semibold">lat,lng</span> for exact drop-off.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-pink-300 bg-white px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100"
                          onClick={() => {
                            if (!navigator.geolocation) {
                              alert("GPS is not available in this browser.");
                              return;
                            }
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                                setDeliveryLatLng(next);
                                setMapInput(`${next.lat},${next.lng}`);
                              },
                              () => alert("Could not get GPS location. Please allow location access."),
                              { enableHighAccuracy: true, timeout: 8000 },
                            );
                          }}
                        >
                          Use my GPS
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-pink-300 bg-white px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-pink-100"
                          onClick={() => {
                            setDeliveryLatLng(null);
                            setMapInput("");
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className="text-xs font-semibold text-pink-600">Maps link or lat,lng</span>
                        <input
                          type="text"
                          value={mapInput}
                          onChange={(e) => {
                            const next = e.target.value;
                            setMapInput(next);
                            setDeliveryLatLng(tryParseLatLng(next));
                          }}
                          className="mt-1 w-full rounded-lg border border-pink-300 bg-white px-3 py-2 text-sm text-pink-700"
                          placeholder="https://maps.google.com/... or 14.5995,120.9842"
                        />
                      </label>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-pink-600">Preview</p>
                          {deliveryLatLng ? (
                            <a
                              className="text-xs font-semibold text-pink-700 underline"
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${deliveryLatLng.lat},${deliveryLatLng.lng}`,
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open in Google Maps
                            </a>
                          ) : null}
                        </div>

                        <div className="mt-2 overflow-hidden rounded-2xl border border-pink-200 bg-white">
                          <iframe
                            title="Delivery location preview"
                            className="h-[260px] w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                              deliveryLatLng ? `${deliveryLatLng.lat},${deliveryLatLng.lng}` : deliveryAddress || "New York",
                            )}&output=embed`}
                          />
                        </div>
                        <p className="mt-2 text-xs text-pink-600">
                          {deliveryLatLng
                            ? `Pinned: ${deliveryLatLng.lat.toFixed(6)}, ${deliveryLatLng.lng.toFixed(6)}`
                            : "Tip: add a pin for the most accurate drop-off point."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium text-pink-600">Delivery Speed</span>
                    <select
                      value={deliveryOption}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-pink-300 px-3 py-2"
                    >
                      <option value="Standard">Standard (2-3 days)</option>
                      <option value="Express">Express (1 day)</option>
                      <option value="Same-day">Same-day</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-pink-600">Payment Method</span>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-pink-300 px-3 py-2"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </label>
                  <button
                    className="rounded-full bg-pink-700 px-5 py-2 text-white hover:bg-pink-800"
                    onClick={() => {
                      placeOrder(
                        deliveryAddress,
                        contactPhone,
                        deliveryOption,
                        paymentMethod,
                        deliveryLatLng,
                      );
                      setShowDelivery(false);
                    }}
                    disabled={!deliveryAddress || !contactPhone}
                  >
                    Confirm Delivery & Place Order
                  </button>
                </div>
              )}
            </article>
          </div>
        )}
      </section>
  );
}

CartPage.layout = page => <ShopLayout>{page}</ShopLayout>;
