import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useShop } from "@/context/ShopContext";
import axios from "axios";

export const SiteHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);

  const { cart } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const { auth } = usePage<{ auth?: { user?: { name: string; role: string } } }>().props;
  const user = auth?.user;
  const role = user?.role ?? null;
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
        try {
            const res = await axios.get('/api/unread-messages-count');
            setUnreadCount(res.data.count);
        } catch (e) {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => {
    const isActive = currentPath === href;
    if (mobile) {
      return (
        <Link
          href={href}
          className={`block w-full px-4 py-3 text-base font-bold transition-all duration-200 rounded-xl
            ${isActive ? "bg-brand-100 text-brand-800 shadow-sm" : "text-brand-400 hover:bg-brand-50 hover:text-brand-700"}`}
        >
          {children}
        </Link>
      );
    }
    return (
      <Link
        href={href}
        className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-150
          ${isActive ? "text-brand-800" : "text-brand-400 hover:text-brand-700"}`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-brand-500" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${scrolled || isMobileMenuOpen
          ? "bg-white shadow-lg shadow-brand-100/50 backdrop-blur-xl"
          : "bg-white/90 backdrop-blur-md"
        }`}
    >
      <div
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        {/* ─── LEFT: Logo ─── */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-all hover:opacity-75 active:scale-95"
          >
            {logoLoaded ? (
              <img
                src="/velvet-vine-logo.png"
                alt="Velvet & Vine"
                className="h-10 w-10 object-contain"
                onError={() => setLogoLoaded(false)}
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                VV
              </span>
            )}
            <span className="hidden sm:block text-lg font-extrabold tracking-tight text-brand-900">
              Velvet <span className="text-brand-400">&amp;</span> Vine
            </span>
          </Link>
        </div>

        {/* ─── CENTER: Nav links (Desktop) ─── */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/home">Store</NavLink>

          <NavLink href="/cart">
            <span className="flex items-center gap-1.5">
              Cart
              {cartCount > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>

          <NavLink href="/orders">Orders</NavLink>
          {user && (
            <NavLink href="/messages">
              Messages
              {unreadCount > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-1 ring-white">
                    {unreadCount}
                </span>
              )}
            </NavLink>
          )}
          {user && <NavLink href="/profile">Profile</NavLink>}
          {role === "admin" && <NavLink href="/admin">Admin</NavLink>}
          {role === "rider" && <NavLink href="/rider">Rider</NavLink>}
        </nav>

        {/* ─── RIGHT: Auth buttons (Desktop) ─── */}
        <div className="hidden md:flex items-center justify-end gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-brand-400 xl:block">
                Hi,&nbsp;<strong className="font-semibold text-brand-700">{user.name}</strong>
              </span>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="rounded-full border-2 border-brand-300 px-6 py-1.5 text-sm font-semibold text-brand-700
                           transition-all duration-150 hover:border-brand-400 hover:bg-brand-50 active:scale-95"
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border-2 border-brand-300 px-7 py-1.5 text-sm font-semibold text-brand-700
                           transition-all duration-150 hover:border-brand-400 hover:bg-brand-50 active:scale-95"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand-600 px-7 py-1.5 text-sm font-semibold text-white
                           shadow-md shadow-brand-200 transition-all duration-150
                           hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-300 active:scale-95"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ─── MOBILE: Hamburger Button ─── */}
        <div className="flex md:hidden items-center gap-4">
            <Link href="/cart" className="relative p-2 text-brand-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                        {cartCount}
                    </span>
                )}
            </Link>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-brand-50 text-brand-700 active:scale-90 transition-all"
            >
                {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>
        </div>
      </div>

      {/* ─── MOBILE: Navigation Drawer ─── */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in px-6 pb-8 pt-2 space-y-6">
            <div className="h-px bg-brand-100 mb-4" />
            <nav className="flex flex-col gap-2">
                <NavLink href="/home" mobile>Store</NavLink>
                <NavLink href="/orders" mobile>Orders</NavLink>
                {user && <NavLink href="/messages" mobile>Messages</NavLink>}
                {user && <NavLink href="/profile" mobile>Profile</NavLink>}
                {role === "admin" && <NavLink href="/admin" mobile>Admin Dashboard</NavLink>}
                {role === "rider" && <NavLink href="/rider" mobile>Rider Dashboard</NavLink>}
            </nav>

            <div className="flex flex-col gap-3 pt-4">
                {user ? (
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full rounded-xl bg-brand-50 px-6 py-3 text-center font-bold text-brand-700"
                    >
                        Sign Out
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="w-full rounded-xl border-2 border-brand-200 px-6 py-3 text-center font-bold text-brand-700"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="w-full rounded-xl bg-brand-600 px-6 py-3 text-center font-bold text-white shadow-lg shadow-brand-200"
                        >
                            Create Account
                        </Link>
                    </>
                )}
            </div>
        </div>
      )}

      {/* Gradient divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
    </header>
  );
};
