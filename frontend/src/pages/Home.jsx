import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Sparkles, BookOpen, Clock, Target, ArrowRight, CheckCircle2, Github, GitFork, LayoutDashboard, LogOut } from 'lucide-react';

export default function Home() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
            {/* Dynamic Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-4 lg:py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-blue-500/20 to-blue-600/10 border border-blue-500/20 backdrop-blur-xl">
                        <BookOpen className="text-blue-400 w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        StudyBuddy AI
                    </span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="hidden sm:flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
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

                    {token ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium bg-white text-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-100 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] group/logout"
                            >
                                <LogOut size={16} className="text-slate-500 group-hover/logout:text-red-500 transition-colors" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                className="text-sm font-medium bg-white text-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-100 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-2 pb-6 lg:pt-4 lg:pb-16 lg:flex lg:items-center lg:gap-16">
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>The next generation of learning</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight">
                        Master any subject with your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Personal AI Tutor
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Upload your materials, generate instant quizzes and flashcards, create personalized study plans, and chat with an AI that understands your learning style.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-8">
                        {token ? (
                            <Link
                                to="/dashboard"
                                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-8 py-4 rounded-full w-full sm:w-auto hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-1"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-full w-full sm:w-auto hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-1"
                            >
                                Start Learning for Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>

                    <div className="pt-16 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Passwordless OTP Login</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Smart Document Analysis</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 mt-6 lg:-mt-12 relative hidden lg:block">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10 bg-[#0c1222]">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                            alt="Students studying collaboratively"
                            className="w-full h-auto object-cover opacity-80 mix-blend-lighten"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 mix-blend-overlay"></div>
                    </div>
                    {/* Decorative back-glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-3xl opacity-20 -z-10"></div>
                </div>
            </main>

            {/* Feature Cards Grid */}
            <div className="relative z-10 container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 lg:mt-32">
                    {/* Card 1 */}
                    <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors duration-300">
                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                            <Brain className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">AI Document Analysis</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Upload notes or recordings. Our AI extracts key concepts and generates comprehensive summaries instantly.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors duration-300 md:-translate-y-4">
                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Smart Quizzes & Flashcards</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Test your knowledge with automatically generated quizzes and flashcards tailored to your specific study materials.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors duration-300">
                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                            <Clock className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Adaptive Study Plans</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Tell us your exam date and topics, and get a realistic, optimized daily study schedule.
                        </p>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-white/10 mt-20">
                <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} StudyBuddy AI | Made by <a href="https://github.com/xyferas" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">xyferas</a></p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="https://linkedin.com/in/aswinmuralik" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">LinkedIn</a>
                        <Link to="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-slate-300 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
