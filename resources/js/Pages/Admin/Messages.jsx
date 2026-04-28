import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function AdminMessages({ contacts = [] }) {
    const { auth } = usePage().props;
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
            <Head title="Admin Messages" />
            <div className="flex h-[calc(100vh-200px)] bg-white rounded-3xl border border-brand-100 overflow-hidden shadow-sm">
                {/* Contacts List */}
                <div className="w-1/3 border-r border-brand-100 flex flex-col">
                    <div className="p-6 border-b border-brand-100">
                        <h2 className="text-xl font-black text-brand-900">Conversations</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {contacts.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`w-full p-4 flex items-center gap-3 transition-colors hover:bg-brand-50/50 ${selectedContact?.id === contact.id ? 'bg-brand-50 border-r-4 border-brand-600' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                    {contact.name[0].toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-brand-900">{contact.name}</p>
                                    <p className="text-xs text-brand-400 capitalize">{contact.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-gray-50/30">
                    {selectedContact ? (
                        <>
                            <div className="p-4 bg-white border-b border-brand-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                                    {selectedContact.name[0].toUpperCase()}
                                </div>
                                <h3 className="font-black text-brand-900">{selectedContact.name}</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm font-medium shadow-sm ${
                                                msg.sender_id === auth.user.id
                                                    ? 'bg-brand-600 text-white rounded-tr-none'
                                                    : 'bg-white text-brand-900 border border-brand-100 rounded-tl-none'
                                            }`}
                                        >
                                            {msg.message}
                                            <p className={`text-[10px] mt-1 ${msg.sender_id === auth.user.id ? 'text-brand-100' : 'text-brand-300'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-brand-100 flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-brand-50/50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="bg-brand-600 text-white p-2 rounded-xl hover:bg-brand-700 transition-all shadow-md shadow-brand-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-brand-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.303.025-.607.047-.912.066a1.109 1.109 0 0 0-1.008 1.108 11.481 11.481 0 0 1-.467 3.29 1.188 1.188 0 0 1-1.316.886 12.038 12.038 0 0 1-3.827-1.14 1.125 1.125 0 0 0-1.101.01 11.954 11.954 0 0 1-4.812 1.225c-.357 0-.711-.023-1.058-.069a1.125 1.125 0 0 1-.957-1.123v-1.134c0-.522-.359-.966-.856-1.108a11.554 11.554 0 0 1-1.32-.451c-.433-.18-.63-.701-.457-1.135a11.033 11.033 0 0 1 .505-1.042 1.125 1.125 0 0 0-.611-1.563l-.133-.053a1.125 1.125 0 0 1-.611-1.563 11.233 11.233 0 0 1 .505-1.042c.173-.434-.024-.955-.457-1.135a11.554 11.554 0 0 1-1.32-.451c-.497-.142-.856-.586-.856-1.108v-1.134a1.125 1.125 0 0 1-.957-1.123c-.347-.046-.701-.069-1.058-.069a11.954 11.954 0 0 1-4.812-1.225 1.125 1.125 0 0 0-1.101-.01 12.038 12.038 0 0 1-3.827 1.14 1.188 1.188 0 0 1-1.316-.886 11.481 11.481 0 0 1-.467-3.29 1.109 1.109 0 0 0-1.008-1.108 11.71 11.71 0 0 1-.912-.066c-1.133-.093-1.98-.957-1.98-2.193V10.608c0-.969.616-1.813 1.5-2.097a47.93 47.93 0 0 1 21 0Z" />
                            </svg>
                            <p className="font-bold">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminMessages.layout = page => <AdminLayout>{page}</AdminLayout>;
