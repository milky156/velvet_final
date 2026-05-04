import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '@/context/ShopContext';
import { router } from '@inertiajs/react';

export default function ChatWidget() {
    const { messages, sendMessage } = useShop();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, suggestions, isOpen, isTyping]);

    // Smart Product Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue.trim().length >= 3) {
                searchProducts(inputValue);
            } else {
                setSuggestions([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [inputValue]);

    const searchProducts = async (keyword) => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/products?search=${encodeURIComponent(keyword)}`);
            const data = await res.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Failed to fetch product suggestions", error);
        } finally {
            setIsSearching(false);
        }
    };

    const getAiResponse = (input) => {
        const text = input.toLowerCase();
        
        if (text.includes('location') || text.includes('where') || text.includes('place') || text.includes('address')) {
            return "Our walk-in shop is located Beside the New Barangay Hall in San Vicente, Butuan City. We'd love to see you there! 🌸";
        }
        
        if (text.includes('delivery') || text.includes('ship') || text.includes('doorstep')) {
            return "We offer Shop-to-Door delivery service! You can choose between Standard (2-3 days), Express (1 day), or even Same-day delivery for urgent floral needs. 🚚";
        }

        if (text.includes('function') || text.includes('how to') || text.includes('system') || text.includes('help')) {
            return "Velvet & Vine is a smart floral boutique system. You can browse our catalog, customize your bouquets with special wrapping styles, add personal dedications, and track your delivery in real-time. Just add items to your cart and follow the checkout process! ✨";
        }

        if (text.includes('product') || text.includes('flower') || text.includes('bouquet') || text.includes('stock')) {
            return "We offer a wide variety of fresh Flowers, curated Bouquets, Pots, Tools, and even specialty Soil. Check out our 'Products' section for the latest seasonal arrivals! 💐";
        }

        if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
            return "Hello! I'm your Velvet & Vine AI assistant. How can I help you today? You can ask about our location, products, or delivery services!";
        }

        return "That's a great question! I'm still learning, but I can help you with information about our shop location (San Vicente), our products, and our door-to-door delivery services. Feel free to ask!";
    };

    const handleSend = (e) => {
        e.preventDefault();
        const message = inputValue.trim();
        if (!message) return;

        sendMessage(message, "customer");
        setInputValue('');
        setSuggestions([]);

        // Trigger AI Response
        setIsTyping(true);
        setTimeout(() => {
            const response = getAiResponse(message);
            sendMessage(response, "ai");
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 transition-all hover:scale-105"
                >
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </div>
                </button>
            )}

            {/* Chat Box */}
            {isOpen && (
                <div className="flex flex-col w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-2xl bg-white shadow-2xl border border-brand-100 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">AI</div>
                            <div>
                                <h3 className="font-bold">Smart Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <p className="text-[10px] text-brand-100 uppercase tracking-widest font-black">Online Help</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-brand-100 hover:text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-brand-50 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-8 px-4">
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-brand-100 flex items-center justify-center mx-auto mb-4 text-2xl">🤖</div>
                                <p className="text-brand-900 font-black text-sm mb-1">Hello! I'm your Velvet & Vine Assistant.</p>
                                <p className="text-brand-400 text-xs font-medium">Ask me about our products, delivery, or where to find our shop in San Vicente!</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.from === 'customer' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                                        msg.from === 'customer' 
                                            ? 'bg-brand-600 text-white rounded-tr-sm' 
                                            : 'bg-white text-brand-900 border border-brand-100 rounded-tl-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-start gap-2 animate-pulse">
                                <div className="bg-white border border-brand-100 rounded-2xl px-4 py-2 flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-300"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-300"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-300"></span>
                                </div>
                            </div>
                        )}

                        {/* Suggestions Area */}
                        {suggestions.length > 0 && (
                            <div className="flex flex-col items-start animate-fade-in">
                                <div className="max-w-[95%] rounded-2xl bg-white border border-brand-200 px-4 py-3 shadow-sm rounded-tl-sm">
                                    <p className="text-xs font-bold text-brand-400 mb-2 uppercase tracking-wide">Products you might like:</p>
                                    <div className="space-y-2">
                                        {suggestions.map(p => (
                                            <div 
                                                key={p.id} 
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-50 cursor-pointer transition border border-transparent hover:border-brand-200"
                                                onClick={() => {
                                                    setInputValue(`I am interested in the ${p.name}`);
                                                    setSuggestions([]);
                                                }}
                                            >
                                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                                                <div>
                                                    <p className="text-sm font-bold text-brand-900">{p.name}</p>
                                                    <p className="text-xs text-brand-600">₱{Number(p.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="border-t border-brand-100 p-3 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about location, delivery..."
                            className="flex-1 rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-50 hover:bg-brand-700 transition shadow-lg shadow-brand-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 translate-x-px">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
