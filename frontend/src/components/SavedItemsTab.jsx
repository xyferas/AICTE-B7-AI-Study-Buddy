import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, FileText, Calendar, Mic, Loader2, Trash2, X, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SavedItemsTab() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const res = await axios.get(`${API_URL}/api/saved-content`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
        } catch (err) {
            setError('Failed to fetch saved items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const deleteItem = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            await axios.delete(`${API_URL}/api/saved-content/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(items.filter(item => item.id !== id));
            if (selectedItem?.id === id) setSelectedItem(null);
        } catch (err) {
            console.error('Failed to delete item', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'summary': return <FileText size={18} className="text-blue-400" />;
            case 'plan': return <Calendar size={18} className="text-teal-400" />;
            case 'notes': return <Mic size={18} className="text-indigo-400" />;
            default: return <Bookmark size={18} className="text-slate-400" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'summary': return 'bg-blue-500/10 border-blue-500/20';
            case 'plan': return 'bg-teal-500/10 border-teal-500/20 text-teal-100 hover:shadow-teal-500/10';
            case 'notes': return 'bg-indigo-500/10 border-indigo-500/20 hover:shadow-indigo-500/10';
            default: return 'bg-slate-500/10 border-slate-500/20';
        }
    };

    const handleDownload = () => {
        if (!selectedItem || !selectedItem.content_data) return;

        const cleanText = selectedItem.content_data
            .replace(/^#{1,6}\s+(.*)$/gm, '$1')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/~~(.*?)~~/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/^\s*-\s/gm, '• ')
            .replace(/^\s*\*\s/gm, '• ')
            .replace(/\n/g, '\r\n');

        const element = document.createElement("a");
        const file = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);

        // Sanitize title for filename
        const safeTitle = selectedItem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        element.download = `${safeTitle || 'study_content'}.txt`;

        document.body.appendChild(element); // Required for FireFox
        element.click();
        document.body.removeChild(element);
    };

    if (selectedItem) {
        return (
            <div className="h-full flex flex-col bg-[#0A0F1C]/60 rounded-3xl border border-white/10 backdrop-blur-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            {getIcon(selectedItem.content_type)}
                            <h2 className="text-2xl font-bold text-white max-w-2xl truncate">{selectedItem.title}</h2>
                        </div>
                        <p className="text-sm text-slate-400">
                            Saved on {new Date(selectedItem.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 hover:bg-blue-400/20 px-3 py-2 rounded-xl"
                            title="Download as TXT"
                        >
                            <Download size={18} /> <span className="hidden sm:inline">Download</span>
                        </button>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-900/40 rounded-xl p-6 border border-white/5 relative z-10 prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedItem.content_data}
                    </ReactMarkdown>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Bookmark className="text-pink-500" /> Saved Content
                </h2>
                <p className="text-slate-400">View and manage your saved summaries, plans, and voice notes.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 gap-3">
                    <Loader2 size={24} className="animate-spin" /> Loading saved items...
                </div>
            ) : items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-white/5/30 rounded-3xl border border-white/10 border-dashed p-8">
                    <Bookmark size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium text-slate-400">No saved items yet.</p>
                    <p className="text-sm">Generate some content and click the Save button to see it here!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-6 pr-2">
                    {items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`p-5 rounded-2xl border flex flex-col cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${getBgColor(item.content_type)} group`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                    {getIcon(item.content_type)}
                                </div>
                                <button
                                    onClick={(e) => deleteItem(item.id, e)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3 className="font-semibold text-slate-200 mb-1 line-clamp-2" title={item.title}>
                                {item.title || 'Untitled Item'}
                            </h3>
                            <p className="text-xs text-slate-400 mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="capitalize">{item.content_type}</span>
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
