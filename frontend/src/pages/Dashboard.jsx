import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, FileText, Mic, BrainCircuit, Calendar, LogOut, Menu, X, Bookmark, Github, GitFork, Home, Layers, BookOpen } from 'lucide-react';
import ChatTab from '../components/ChatTab';
import SummarizeTab from '../components/SummarizeTab';
import VoiceNotesTab from '../components/VoiceNotesTab';
import QuizTab from '../components/QuizTab';
import FlashcardsTab from '../components/FlashcardsTab';
import PlannerTab from '../components/PlannerTab';
import SavedItemsTab from '../components/SavedItemsTab';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('chat');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { id: 'chat', name: 'AI Chat', icon: MessageSquare },
        { id: 'notes', name: 'Notes Summarizer', icon: FileText },
        { id: 'voice', name: 'Voice to Notes', icon: Mic },
        { id: 'quiz', name: 'Quiz Generator', icon: BrainCircuit },
        { id: 'flashcards', name: 'Flashcards', icon: Layers },
        { id: 'planner', name: 'Study Planner', icon: Calendar },
        { id: 'saved', name: 'Saved Items', icon: Bookmark },
    ];

    // We remove renderContent switch to keep components mounted (which preserves state).

    return (
        <div className="min-h-screen bg-slate-900 text-white flex overflow-hidden">
            {/* Mobile sidebar overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0F1C]/80 border-r border-white/5 backdrop-blur-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl gap-3">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-b from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                            <BookOpen className="text-blue-400 w-4 h-4" />
                        </div>
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                            AI Study Buddy
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]'
                                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-transparent'
                                        }`}
                                >
                                    <Icon size={20} className={`mr-3 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                        <div className="flex items-center mb-4 px-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                                {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={16} className="mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-2"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="text-lg font-semibold text-white">
                            {navigation.find(n => n.id === activeTab)?.name}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            <Home size={16} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        <div className="hidden sm:flex items-center gap-4 pl-4 sm:pl-6 border-l border-slate-700">
                            <a
                                href="https://github.com/xyferas/AICTE-B7-AI-Study-Buddy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
                            >
                                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Star</span>
                            </a>
                            <a
                                href="https://github.com/xyferas/AICTE-B7-AI-Study-Buddy/fork"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
                            >
                                <GitFork className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Fork</span>
                            </a>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto h-full">
                        <div className={activeTab === 'chat' ? 'block h-full' : 'hidden'}><ChatTab /></div>
                        <div className={activeTab === 'notes' ? 'block h-full' : 'hidden'}><SummarizeTab /></div>
                        <div className={activeTab === 'voice' ? 'block h-full' : 'hidden'}><VoiceNotesTab /></div>
                        <div className={activeTab === 'quiz' ? 'block h-full' : 'hidden'}><QuizTab /></div>
                        <div className={activeTab === 'flashcards' ? 'block h-full' : 'hidden'}><FlashcardsTab /></div>
                        <div className={activeTab === 'planner' ? 'block h-full' : 'hidden'}><PlannerTab /></div>
                        <div className={activeTab === 'saved' ? 'block h-full' : 'hidden'}><SavedItemsTab isActive={activeTab === 'saved'} /></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
