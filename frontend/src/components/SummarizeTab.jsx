import React, { useState } from 'react';
import axios from 'axios';
import { AlignLeft, Download, Loader2, Sparkles, Save, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SummarizeTab() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!summary) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            await axios.post(`${API_URL}/api/saved-content`, {
                content_type: 'summary',
                title: text.substring(0, 40) + (text.length > 40 ? '...' : ''),
                content_data: summary
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSummarize = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');
        setSummary('');

        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        try {
            const res = await axios.post(`${API_URL}/api/summarize`, { text });
            setSummary(res.data.summary);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!summary) return;

        const cleanText = summary
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
        element.download = "study_summary.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Input Side */}
            <div className="flex-1 flex flex-col bg-[#0A0F1C]/40 rounded-3xl border border-white/10 backdrop-blur-2xl glass-panel overflow-hidden shadow-xl p-5">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlignLeft className="text-blue-400" size={20} />
                            Input Notes
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Paste textbook paragraphs or lecture notes</p>
                    </div>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your study material here..."
                    className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                />

                <button
                    onClick={handleSummarize}
                    disabled={!text.trim() || loading}
                    className="mt-4 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {loading ? 'Processing...' : 'Summarize Notes'}
                </button>
            </div>

            {/* Output Side */}
            <div className="flex-1 flex flex-col bg-[#0A0F1C]/40 rounded-3xl border border-white/10 backdrop-blur-2xl glass-panel overflow-hidden shadow-xl p-5">
                <div className="mb-4 flex items-center justify-between border-b border-white/10/50 pb-4">
                    <h3 className="text-lg font-semibold text-white">Generated Summary</h3>
                    <div className="flex gap-2">
                        {summary && !summary.includes("study purposes only") && (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || saved}
                                    className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-lg disabled:opacity-50"
                                >
                                    {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Saved!' : 'Save'}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 hover:bg-blue-400/20 px-3 py-1.5 rounded-lg"
                                >
                                    <Download size={16} /> Download
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-900/30 rounded-xl p-6 border border-white/10/30">
                    {error ? (
                        <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                            {error}
                        </div>
                    ) : summary ? (
                        <div className={`prose prose-invert max-w-none ${summary.includes("study purposes only") ? 'text-amber-400' : 'text-slate-300'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <AlignLeft size={24} className="text-slate-600" />
                            </div>
                            <p>Your summary will appear here.<br />Ready to extract key points and bullet lists!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
