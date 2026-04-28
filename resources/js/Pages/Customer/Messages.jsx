import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';
import axios from 'axios';

export default function CustomerMessages({ contacts = [] }) {
    const { auth } = usePage().props;
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            const interval = setInterval(() => fetchMessages(selectedContact.id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(scrollToBottom, [messages]);

    const fetchMessages = async (contactId) => {
        try {
            const response = await axios.get(`/api/messages/${contactId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const response = await axios.post('/api/messages', {
                receiver_id: selectedContact.id,
                message: newMessage
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <>
            <Head title="Messages" />
            <div className="max-w-6xl mx-auto py-12 px-6">
                <div className="flex h-[600px] bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-xl">
                    {/* Contacts List */}
                    <div className="w-1/3 border-r border-pink-100 flex flex-col">
                        <div className="p-6 border-b border-pink-100 bg-pink-50/50">
                            <h2 className="text-xl font-black text-pink-800">Support & Chat</h2>
                            <p className="text-xs text-pink-500 font-medium">Message Admin or your Rider</p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {contacts.length === 0 ? (
                                <div className="p-10 text-center text-pink-300 italic text-sm">
                                    No contacts available.
                                </div>
                            ) : (
                                contacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className={`w-full p-4 flex items-center gap-3 transition-all hover:bg-pink-50/50 ${selectedContact?.id === contact.id ? 'bg-pink-50 border-r-4 border-pink-600' : ''}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                                            {contact.name[0].toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-pink-900">{contact.name}</p>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-pink-400">{contact.role}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col bg-pink-50/20">
                        {selectedContact ? (
                            <>
                                <div className="p-4 bg-white border-b border-pink-100 flex items-center gap-3 shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                                        {selectedContact.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-pink-900 leading-none">{selectedContact.name}</h3>
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Online</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm font-medium shadow-md ${
                                                    msg.sender_id === auth.user.id
                                                        ? 'bg-gradient-to-br from-pink-600 to-pink-700 text-white rounded-tr-none'
                                                        : 'bg-white text-pink-900 border border-pink-100 rounded-tl-none'
                                                }`}
                                            >
                                                {msg.message}
                                                <p className={`text-[10px] mt-1 ${msg.sender_id === auth.user.id ? 'text-pink-100' : 'text-pink-300'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-pink-100 flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-pink-50/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-pink-300"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-pink-600 text-white px-5 rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-100 font-bold text-sm uppercase tracking-wider"
                                    >
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-pink-300 p-10 text-center">
                                <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-4 border border-pink-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-40">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.023c.09-.457-.133-.915-.505-1.215C3.382 16.24 3 14.22 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                </div>
                                <p className="font-black text-pink-800 text-lg">Your Messages</p>
                                <p className="text-pink-400 text-sm mt-1 max-w-xs">Select a contact to start chatting with our team or your delivery rider.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

CustomerMessages.layout = page => <ShopLayout>{page}</ShopLayout>;
