import React, { useState } from 'react';
import axios from 'axios';
import { CalendarDays, Clock, Target, CalendarHeart, Loader2, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PlannerTab() {
    const [topics, setTopics] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [hours, setHours] = useState('2');
    const [days, setDays] = useState('7');

    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topics.trim()) return;
        setLoading(true);
        setError('');
        setPlan('');

        try {
            const res = await axios.post('http://localhost:8000/api/plan', {
                topics,
                end_date: endDate ? endDate.toISOString().split('T')[0] : '',
                hours_per_day: hours,
                days_per_week: days
            });
            setPlan(res.data.plan);

            // Success animation
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4']
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate study plan');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!plan) return;

        const cleanText = plan
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
        element.download = "study_plan.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[400px] flex-shrink-0 flex flex-col pt-2">
                <div className="mb-6 px-1">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
                        <CalendarHeart className="text-teal-400" size={32} /> Schedule
                    </h2>
                    <p className="text-slate-400 text-sm">Organize your subjects into a structured, daily learning blueprint tailored to your exams.</p>
                </div>

                <div className="bg-white/5/40 rounded-2xl border border-white/10/50 backdrop-blur-md p-6 shadow-xl space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Target size={16} className="text-teal-400" /> Syllabus / Subjects
                        </label>
                        <textarea
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            placeholder="e.g. Calculus Ch 1-3, Cell Biology, WWI History"
                            className="w-full h-28 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <CalendarDays size={16} className="text-teal-400" /> Exam / Target Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={new Date()}
                            placeholderText="Select exam date"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 cursor-pointer caret-transparent"
                            wrapperClassName="w-full"
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                                <Clock size={14} className="text-teal-400" /> Hrs / Day
                            </label>
                            <select
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
                            >
                                {['1', '2', '3', '4', '5', '6+'].map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Days / Week</label>
                            <select
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
                            >
                                {['1', '2', '3', '4', '5', '6', '7'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {error && <div className="text-red-400 bg-red-500/10 p-3 rounded-lg text-sm text-center border border-red-500/20">{error}</div>}

                    <button
                        onClick={handleGenerate}
                        disabled={!topics.trim() || loading}
                        className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-teal-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <CalendarHeart size={20} />}
                        {loading ? 'Creating Blueprint...' : 'Generate Plan'}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-[#0A0F1C]/40 rounded-3xl border border-white/10 backdrop-blur-2xl glass-panel overflow-hidden shadow-xl flex flex-col">
                <div className="px-6 py-4 border-b border-white/10/50 bg-white/5/60 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">Your Action Plan</h3>
                    {plan && !plan.includes("study purposes only") && (
                        <button
                            onClick={handleDownload}
                            className="text-sm font-medium text-teal-400 hover:text-teal-300 flex items-center gap-2 hover:bg-teal-400/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Download size={16} /> Save Plan
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-6 bg-slate-900/20">
                    {plan ? (
                        <div className={`prose prose-invert max-w-none ${plan.includes("study purposes only") ? 'text-amber-400' : 'text-slate-300'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
                            <div className="grid grid-cols-2 gap-2 p-3 bg-white/5/50 rounded-xl border border-white/10 w-24 h-24 transform rotate-3">
                                <div className="bg-teal-500/20 rounded-md" />
                                <div className="bg-slate-700/50 rounded-md" />
                                <div className="bg-slate-700/50 rounded-md" />
                                <div className="bg-emerald-500/20 rounded-md" />
                            </div>
                            <p className="max-w-[250px]">Input your topics and timeline to build a personalized study calendar here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
