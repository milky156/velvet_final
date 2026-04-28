import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '@/context/ShopContext';
import { router } from '@inertiajs/react';

export default function ChatWidget() {
    const { messages, sendMessage } = useShop();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, suggestions, isOpen]);

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

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        sendMessage(inputValue.trim(), "customer");
        setInputValue('');
        setSuggestions([]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 transition-all hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                </button>
            )}

            {/* Chat Box */}
            {isOpen && (
                <div className="flex flex-col w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-2xl bg-white shadow-2xl border border-brand-100 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
                        <div>
                            <h3 className="font-bold">Velvet & Vine Support</h3>
                            <p className="text-xs text-brand-100">We typically reply in minutes</p>
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
                            <div className="text-center text-sm text-brand-400 my-4">
                                Send us a message or search for products like "roses" or "bouquets".
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.from === 'customer' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        msg.from === 'customer' 
                                            ? 'bg-brand-600 text-white rounded-tr-sm' 
                                            : 'bg-white text-brand-900 border border-brand-100 rounded-tl-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

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
                                                    <p className="text-xs text-brand-600">${Number(p.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {isSearching && (
                            <div className="text-xs text-brand-400 italic">Searching catalogue...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="border-t border-brand-100 p-3 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message or search..."
                            className="flex-1 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-50 hover:bg-brand-700 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 translate-x-px translate-y-px">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
