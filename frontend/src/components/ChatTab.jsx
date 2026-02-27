import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatTab() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        // Scroll down when user sends a message to see the loader
        setTimeout(() => {
            scrollToBottom();
        }, 100);

        try {
            const res = await axios.post(`${API_URL}/api/chat`, {
                question: userMsg,
                level: level
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
        } catch (err) {
            const errMsg = err.response?.data?.detail || 'Failed to connect to AI server';
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errMsg}`, isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0A0F1C]/40 rounded-3xl border border-white/10 backdrop-blur-2xl glass-panel overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center z-10">
                <div>
                    <h3 className="text-lg font-semibold text-white">Study Chat</h3>
                    <p className="text-xs text-slate-400">Ask any educational question</p>
                </div>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-[#0c1222] border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                    <option className="bg-[#0c1222] text-slate-200" value="Beginner">Beginner</option>
                    <option className="bg-[#0c1222] text-slate-200" value="Intermediate">Intermediate</option>
                    <option className="bg-[#0c1222] text-slate-200" value="Advanced">Advanced</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20">
                            <Bot size={32} className="text-blue-400" />
                        </div>
                        <p>How can I help you study today?</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-md
                ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm prose prose-invert max-w-none
                ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm prose-p:text-white prose-a:text-indigo-200'
                                    : msg.isError
                                        ? 'bg-red-500/10 border border-red-500/30 text-rose-200 rounded-tl-sm'
                                        : 'bg-white/5 text-slate-200 border border-white/10 backdrop-blur-md rounded-tl-sm'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-start gap-3 max-w-[80%]">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mt-1 shadow-md">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md rounded-tl-sm text-slate-400 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Thinking...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black/20 border-t border-white/10">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        disabled={loading}
                        className="w-full bg-black/40 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
