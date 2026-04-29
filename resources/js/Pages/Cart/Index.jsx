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
    const lat = Number(direct[1]), lng = Number(direct[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  const at = s.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) {
    const lat = Number(at[1]), lng = Number(at[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  const q = s.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (q) {
    const lat = Number(q[1]), lng = Number(q[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}

// Reverse geocode lat/lng to a human-readable address using free Nominatim API
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
    const data = await res.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

function WarningBadge({ message }) {
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-red-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <span className="text-xs font-semibold">{message}</span>
    </div>
  );
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
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cartDetails = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { item, product };
  });

  const cartTotal = cartDetails.reduce((total, entry) => {
    if (!entry.product) return total;
    return total + entry.product.price * entry.item.quantity;
  }, 0);

  const totalItems = cartDetails.reduce((sum, entry) => sum + entry.item.quantity, 0);

  const handleGps = async () => {
    if (!navigator.geolocation) {
      alert("GPS is not available in this browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setDeliveryLatLng(next);
        setMapInput(`${next.lat},${next.lng}`);
        // Reverse geocode to fill address
        const address = await reverseGeocode(next.lat, next.lng);
        setDeliveryAddress(address);
        setGpsLoading(false);
      },
      () => {
        alert("Could not get GPS location. Please allow location access.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handlePlaceOrder = () => {
    setSubmitted(true);
    if (!deliveryAddress.trim() || !contactPhone.trim()) return;
    placeOrder(deliveryAddress, contactPhone, deliveryOption, paymentMethod, deliveryLatLng);
    setShowDelivery(false);
    setSubmitted(false);
  };

  // Validation states
  const showAddressWarning = submitted && !deliveryAddress.trim();
  const showPhoneWarning = submitted && !contactPhone.trim();

  return (
    <>
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
            {/* Cart items */}
            {cartDetails.map((entry) => (
              <article key={entry.item.productId} className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
                <div className="mb-3 grid gap-4 sm:grid-cols-[120px_1fr_1fr]">
                  {/* Product image */}
                  <div className="h-24 w-full overflow-hidden rounded-xl border border-pink-100 bg-pink-50">
                    {entry.product?.image ? (
                      <img
                        src={entry.product.image}
                        alt={entry.product?.name ?? "Product"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl opacity-40">🌸</span>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div>
                    <h2 className="text-lg font-bold text-pink-700">{entry.product?.name ?? "Unknown Product"}</h2>
                    <p className="text-sm text-pink-600">₱{Number(entry.product?.price ?? 0).toFixed(2)} each</p>
                    <p className="text-sm font-bold text-pink-700 mt-1">
                      Subtotal: ₱{(Number(entry.product?.price ?? 0) * entry.item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full border border-pink-300 w-8 h-8 flex items-center justify-center text-pink-700 hover:bg-pink-50 transition-all font-bold"
                        onClick={() => updateCartQty(entry.item.productId, Math.max(1, entry.item.quantity - 1))}
                      >−</button>
                      <input
                        type="number"
                        value={entry.item.quantity}
                        min={1}
                        onChange={(e) => updateCartQty(entry.item.productId, Number(e.target.value))}
                        className="w-14 rounded-lg border border-pink-300 px-2 py-1 text-center text-pink-700 text-sm"
                      />
                      <button
                        className="rounded-full border border-pink-300 w-8 h-8 flex items-center justify-center text-pink-700 hover:bg-pink-50 transition-all font-bold"
                        onClick={() => updateCartQty(entry.item.productId, entry.item.quantity + 1)}
                      >+</button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {/* Only show customization for Flowers or Bouquets */}
                      {(entry.product?.categories?.some(c => c.name === 'Flowers' || c.name === 'Bouquets') || !entry.product?.categories) && (
                        <>
                          <div>
                            <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest ml-1">Wrapping Style</label>
                            <select
                              value={entry.item.wrap ?? "Paper wrap (Korean style)"}
                              onChange={(e) => updateCartItem(entry.item.productId, { wrap: e.target.value })}
                              className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all text-pink-700"
                            >
                              <option value="Paper wrap (Korean style)">Paper wrap (Korean style)</option>
                              <option value="Cellophane wrap">Cellophane wrap</option>
                              <option value="Tissue wrap">Tissue wrap</option>
                              <option value="Kraft paper wrap">Kraft paper wrap</option>
                              <option value="Fabric wrap">Fabric wrap</option>
                              <option value="Mesh wrap">Mesh wrap</option>
                              <option value="Waterproof wrap">Waterproof wrap</option>
                              <option value="Boxed bouquet (flower box)">Boxed bouquet (flower box)</option>
                              <option value="Cone wrap">Cone wrap</option>
                              <option value="Envelope wrap">Envelope wrap</option>
                              <option value="Fan wrap">Fan wrap</option>
                              <option value="Layered wrap">Layered wrap</option>
                              <option value="Burlap wrap">Burlap wrap</option>
                              <option value="Newspaper wrap">Newspaper wrap</option>
                              <option value="Jute or twine wrap">Jute or twine wrap</option>
                              <option value="Hand-tied bouquet">Hand-tied bouquet</option>
                              <option value="Ribbon-only wrap">Ribbon-only wrap</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-pink-300 uppercase tracking-widest ml-1">Personal Dedication</label>
                            <textarea
                              value={entry.item.note || "Dedication: "}
                              onChange={(e) => updateCartItem(entry.item.productId, { note: e.target.value })}
                              placeholder="Type your message here..."
                              rows={2}
                              className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                            />
                            <p className="text-[10px] text-pink-400 mt-1 ml-1">Recommendation: Keep it short and sweet! ✨</p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      className="mt-3 rounded-full bg-red-100 px-3 py-1 text-sm text-red-600 font-semibold hover:bg-red-200 transition-all"
                      onClick={() => removeFromCart(entry.item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Order Summary + Delivery */}
            <article className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-pink-700">Order Summary</h2>
              <p className="mt-2 text-base text-pink-700">Total Items: {totalItems}</p>
              <p className="text-2xl font-bold text-pink-800">Total: ₱{Number(cartTotal).toFixed(2)}</p>

              {!showDelivery ? (
                <div className="mt-4">
                  <button
                    className="rounded-full bg-pink-700 px-6 py-3 text-white font-bold hover:bg-pink-800 transition-all shadow-md"
                    onClick={() => setShowDelivery(true)}
                  >
                    Finalize Order
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {/* Delivery Address */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-bold text-pink-700">
                        Delivery Address <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm transition-all ${showAddressWarning ? 'border-red-400 bg-red-50 ring-2 ring-red-200' : 'border-pink-300'}`}
                        placeholder="Enter your full delivery address"
                      />
                      {showAddressWarning && <WarningBadge message="Delivery address is required" />}
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-pink-700">
                        Contact Phone <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className={`mt-1 w-full rounded-xl border px-4 py-2.5 text-sm transition-all ${showPhoneWarning ? 'border-red-400 bg-red-50 ring-2 ring-red-200' : 'border-pink-300'}`}
                        placeholder="e.g. 09123456789"
                      />
                      {showPhoneWarning && <WarningBadge message="Contact phone is required" />}
                    </label>
                  </div>

                  {/* GPS / Map section */}
                  <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-pink-700">📍 Delivery Pin (Google Maps)</p>
                        <p className="mt-1 text-xs text-pink-600">
                          Use GPS for auto-fill, or paste a Google Maps link.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={gpsLoading}
                          className="rounded-full border border-pink-300 bg-white px-4 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
                          onClick={handleGps}
                        >
                          {gpsLoading ? (
                            <>
                              <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                              Locating…
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                              </svg>
                              Use my GPS
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-pink-300 bg-white px-3 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-all"
                          onClick={() => { setDeliveryLatLng(null); setMapInput(""); }}
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
                          className="mt-1 w-full rounded-xl border border-pink-300 bg-white px-4 py-2.5 text-sm text-pink-700"
                          placeholder="https://maps.google.com/... or 14.5995,120.9842"
                        />
                      </label>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-pink-600">Preview</p>
                          {deliveryLatLng && (
                            <a
                              className="text-xs font-semibold text-pink-700 underline"
                              href={`https://www.google.com/maps/search/?api=1&query=${deliveryLatLng.lat},${deliveryLatLng.lng}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open in Google Maps
                            </a>
                          )}
                        </div>
                        <div className="mt-2 overflow-hidden rounded-2xl border border-pink-200 bg-white">
                          <iframe
                            title="Delivery location preview"
                            className="h-[260px] w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                              deliveryLatLng ? `${deliveryLatLng.lat},${deliveryLatLng.lng}` : deliveryAddress || "Philippines",
                            )}&output=embed`}
                          />
                        </div>
                        <p className="mt-2 text-xs text-pink-600">
                          {deliveryLatLng
                            ? `📍 Pinned: ${deliveryLatLng.lat.toFixed(6)}, ${deliveryLatLng.lng.toFixed(6)}`
                            : "Tip: Click 'Use my GPS' to auto-detect your location and address."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Payment options */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-bold text-pink-700">Delivery Speed</span>
                      <select
                        value={deliveryOption}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-pink-300 px-4 py-2.5 text-sm"
                      >
                        <option value="Standard">Standard (2-3 days)</option>
                        <option value="Express">Express (1 day)</option>
                        <option value="Same-day">Same-day</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-pink-700">Payment Method</span>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-pink-300 px-4 py-2.5 text-sm"
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </label>
                  </div>

                  {/* Validation summary */}
                  {submitted && (!deliveryAddress.trim() || !contactPhone.trim()) && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <p className="text-sm font-semibold text-red-700">Please fill in all required fields before placing your order.</p>
                    </div>
                  )}

                  {/* Place Order button */}
                  <button
                    className="w-full rounded-full bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-3.5 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-pink-200 text-base"
                    onClick={handlePlaceOrder}
                  >
                    Confirm Delivery & Place Order
                  </button>
                </div>
              )}
            </article>
          </div>
        )}
      </section>
    </>
  );
}

CartPage.layout = page => <ShopLayout>{page}</ShopLayout>;
