import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { BouquetHeroIllustration } from "@/Components/admin/AdminIllustration";
import {
    BestSellerBouquets,
    DeviceTypeDonut,
    InventoryStockWarnings,
    MiniStat,
    MonthlyRevenueBars,
    SalesLineChart,
} from "@/Components/admin/AdminCharts";
import AdminLayout from "@/Layouts/AdminLayout";

export default function AdminPage({ dbOrders = [], dbProducts = [], dbUsers = [], stats = {} }) {
    const [selectedContact, setSelectedContact] = useState(null);
    const [reply, setReply] = useState("");
    const [messages, setMessages] = useState([]);

    // Fetch messages for selected contact
    useEffect(() => {
        if (!selectedContact) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/messages/${selectedContact.id}`);
                setMessages(res.data);
            } catch (e) {
                console.error("Failed to fetch messages");
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedContact]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!reply.trim() || !selectedContact) return;

        const text = reply;
        setReply("");

        try {
            await axios.post("/api/messages", {
                receiver_id: selectedContact.id,
                message: text,
            });
            // Update local state for instant feedback
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender_id: authUser?.id,
                    message: text,
                    created_at: new Date().toISOString(),
                },
            ]);
        } catch (e) {
            console.error("Failed to send message");
        }
    };

    return (
        <>
            <Head title="Dashboard — Admin" />
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-brand-900 leading-tight">Overview</h1>
                        <p className="text-sm text-brand-400 font-medium mt-1">Monitor sales, inventory, and customer interactions.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/orders" className="rounded-full border border-pink-200 bg-white px-6 py-2.5 text-sm font-black text-brand-600 hover:bg-brand-50 transition-all shadow-sm">
                            View Orders →
                        </Link>
                    </div>
                </div>

                {/* Top stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Total Revenue', value: `₱${parseFloat(stats.totalRevenue || 0).toLocaleString()}` },
                        { label: 'Total Orders', value: stats.totalOrders ?? dbOrders.length },
                        { label: 'Total Users', value: stats.totalUsers ?? uniqueUsers },
                        { label: 'Products', value: stats.totalProducts ?? dbProducts.length },
                        { label: 'Pending', value: stats.pendingOrders ?? 0 },
                        { label: 'Low Stock', value: stats.lowStock ?? 0 },
                    ].map(s => (
                        <div key={s.label} className="rounded-3xl border border-pink-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                            <p className="text-[10px] font-black uppercase tracking-widest text-pink-700/60">{s.label}</p>
                            <p className="mt-3 text-2xl font-black text-brand-900 leading-none">{s.value}</p>
                        </div>
                    ))}
                </div>

                <section id="analysis" className="grid gap-6 xl:grid-cols-12">
                    <div className="rounded-[2.5rem] border border-pink-200 bg-white p-8 shadow-xl shadow-pink-100/10 xl:col-span-7">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-100 text-[10px] font-black uppercase tracking-widest text-pink-500 mb-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                                    </span>
                                    Live Performance
                                </div>
                                <h2 className="text-3xl font-black text-brand-900">Store Activity</h2>
                                <p className="mt-2 text-sm text-brand-400 font-medium leading-relaxed">Today's sales performance and customer growth metrics compared to yesterday.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-pink-200 bg-brand-50 p-5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-700/60">Today's Sales</p>
                                    <p className="mt-2 text-2xl font-black text-brand-900">₱{todaysSales.toLocaleString()}</p>
                                    <p className="mt-1 text-[11px] font-bold text-pink-500">{todaysOrders.length} confirmed orders</p>
                                </div>
                                <div className="rounded-2xl border border-pink-200 bg-brand-50 p-5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-700/60">Growth</p>
                                    <p className={`mt-2 text-2xl font-black ${growthRate >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {growthRate >= 0 ? "+" : ""}{growthRate.toFixed(1)}%
                                    </p>
                                    <p className="mt-1 text-[11px] font-bold text-pink-500">vs yesterday</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center items-center min-h-[340px] bg-pink-50/20 rounded-[2rem] border border-pink-100/50 overflow-hidden shadow-inner group relative">
                            <BouquetHeroIllustration />
                        </div>
                    </div>

                    <div className="grid gap-6 xl:col-span-5">
                        <MiniStat label="Unique Buyers" value={uniqueUsers > 0 ? uniqueUsers.toLocaleString() : "—"} subValue={dbOrders.length > 0 ? "Verified customer accounts with orders" : "Waiting for first sale"} />
                        <MiniStat label="Catalog Depth" value={dbProducts.length.toLocaleString()} subValue="Active products in inventory" />
                        <MiniStat label="User Base" value={(stats.totalUsers ?? 0).toLocaleString()} subValue="Total registered accounts" />
                    </div>
                </section>

                <section id="charts" className="grid gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-7"><SalesLineChart points={hourBuckets} /></div>
                    <div className="xl:col-span-5">
                        <DeviceTypeDonut items={[
                            { label: "Desktop", value: 35, color: "#ff4fa3" },
                            { label: "Tablet", value: 18, color: "#ff86bf" },
                            { label: "Mobile", value: 47, color: "#b81b63" },
                        ]} />
                    </div>
                    <div className="xl:col-span-7"><MonthlyRevenueBars months={monthly} /></div>
                    <div className="xl:col-span-5"><BestSellerBouquets items={bestSellers} /></div>
                </section>

                <div className="grid gap-8 xl:grid-cols-12">
                    <div className="xl:col-span-4 h-full">
                        <InventoryStockWarnings items={stockWarnings} />
                    </div>

                    {/* Functional Admin Chat */}
                    <section id="chat" className="rounded-[2.5rem] border border-pink-200 bg-white shadow-xl shadow-pink-100/10 xl:col-span-8 flex flex-col h-[520px] overflow-hidden">
                        <div className="grid grid-cols-12 h-full">
                            {/* Contacts List */}
                            <div className="col-span-4 border-r border-pink-100 flex flex-col bg-brand-50/30">
                                <div className="p-5 border-b border-pink-100 bg-white">
                                    <h2 className="text-lg font-black text-brand-900 tracking-tight">Messages</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-300">Customer Support</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {dbUsers.filter(u => u.role !== 'admin').map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelectedContact(user)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedContact?.id === user.id ? 'bg-white shadow-md border border-pink-100' : 'hover:bg-pink-50'}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-black text-sm shrink-0">
                                                {user.name?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-xs font-black text-brand-900 truncate">{user.name}</p>
                                                <p className="text-[10px] font-bold text-brand-400 truncate">{user.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div className="col-span-8 flex flex-col bg-white">
                                {selectedContact ? (
                                    <>
                                        {/* Chat Header with User Info */}
                                        <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-pink-50/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-white font-black text-xs">
                                                    {selectedContact.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-brand-900">{selectedContact.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Chat</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black text-pink-500 uppercase tracking-tighter">{selectedContact.phone || 'No Phone'}</p>
                                                <p className="text-[9px] font-bold text-brand-300 max-w-[150px] truncate">{selectedContact.address || 'No Address'}</p>
                                            </div>
                                        </div>

                                        {/* Messages area */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-80">
                                            {messages.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center opacity-40">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.303.025-.607.047-.912.066a1.109 1.109 0 0 0-1.008 1.108 11.481 11.481 0 0 1-.467 3.29 1.188 1.188 0 0 1-1.316.886 12.038 12.038 0 0 1-3.827-1.14 1.125 1.125 0 0 0-1.101.01 11.954 11.954 0 0 1-4.812 1.225c-.357 0-.711-.023-1.058-.069a1.125 1.125 0 0 1-.957-1.123v-1.134c0-.522-.359-.966-.856-1.108a11.554 11.554 0 0 1-1.32-.451c-.433-.18-.63-.701-.457-1.135a11.033 11.033 0 0 1 .505-1.042 1.125 1.125 0 0 0-.611-1.563l-.133-.053a1.125 1.125 0 0 1-.611-1.563 11.233 11.233 0 0 1 .505-1.042c.173-.434-.024-.955-.457-1.135a11.554 11.554 0 0 1-1.32-.451c-.497-.142-.856-.586-.856-1.108v-1.134a1.125 1.125 0 0 1-.957-1.123c-.347-.046-.701-.069-1.058-.069a11.954 11.954 0 0 1-4.812-1.225 1.125 1.125 0 0 0-1.101-.01 12.038 12.038 0 0 1-3.827 1.14 1.188 1.188 0 0 1-1.316-.886 11.481 11.481 0 0 1-.467-3.29 1.109 1.109 0 0 0-1.008-1.108 11.71 11.71 0 0 1-.912-.066c-1.133-.093-1.98-.957-1.98-2.193V10.608c0-.969.616-1.813 1.5-2.097a47.93 47.93 0 0 1 21 0Z" />
                                                    </svg>
                                                    <p className="text-xs font-black uppercase tracking-widest">No conversation history</p>
                                                </div>
                                            ) : (
                                                messages.map((msg) => (
                                                    <div key={msg.id} className={`flex ${msg.sender_id === authUser?.id ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender_id === authUser?.id ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-pink-50 text-brand-900 rounded-tl-none border border-pink-100'}`}>
                                                            <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                                            <p className={`text-[9px] mt-1 font-bold ${msg.sender_id === authUser?.id ? 'text-brand-300' : 'text-brand-400'}`}>
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Input box */}
                                        <form onSubmit={handleSendMessage} className="p-5 border-t border-pink-100 bg-brand-50/20">
                                            <div className="flex gap-3">
                                                <input
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                    placeholder={`Message ${selectedContact.name}...`}
                                                    className="flex-1 rounded-2xl border border-pink-200 bg-white px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-brand-100 focus:border-brand-400 focus:outline-none transition-all"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!reply.trim()}
                                                    className="rounded-2xl bg-brand-600 px-6 py-3 font-black text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-200"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-300 mb-6 animate-pulse">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-black text-brand-900 tracking-tight">Select a conversation</h3>
                                        <p className="text-sm text-brand-400 font-medium max-w-xs mx-auto mt-2">Choose a customer from the left panel to view their profile information and start chatting.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminPage.layout = page => <AdminLayout>{page}</AdminLayout>;
