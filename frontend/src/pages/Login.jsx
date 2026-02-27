import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, ArrowRight, Mail, KeyRound } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { token, login } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#0A0F1C] font-sans">
            {/* Split Layout Container */}
            <div className="h-screen w-full flex flex-col lg:flex-row">

                {/* Left Side: Decorative Image & Branding */}
                <div className="hidden lg:flex flex-col relative w-1/2 p-12 overflow-hidden justify-between border-r border-white/5 bg-[#050914]">
                    {/* Abstract Image Background */}
                    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                            alt="Abstract AI Graphic"
                            className="object-cover w-full h-full scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-blue-500/20 to-blue-600/10 border border-blue-500/20 backdrop-blur-xl">
                            <BookOpen className="text-blue-400 w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            StudyBuddy AI
                        </span>
                    </div>

                    <div className="relative z-10 max-w-lg mb-12">
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                            Elevate your learning with intelligent insights.
                        </h2>
                        <ul className="space-y-4 text-slate-300">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <span className="text-blue-400 text-xs">✓</span>
                                </div>
                                Secure workspace access
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <span className="text-blue-400 text-xs">✓</span>
                                </div>
                                Instant AI-generated resources
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <span className="text-blue-400 text-xs">✓</span>
                                </div>
                                Secure document analysis
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Authentication Form */}
                <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                    {/* Premium Background Effects for Mobile */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
                        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
                    </div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                    <div className="relative z-10 w-full max-w-[420px]">
                        {/* Logo area (Mobile Only) */}
                        <div className="flex lg:hidden flex-col items-center justify-center mb-10 animate-float">
                            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] backdrop-blur-xl mb-4">
                                <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl"></div>
                                <BookOpen size={28} className="text-blue-400 relative z-10" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
                            <p className="text-slate-400 text-center text-sm">Sign in to your account</p>
                        </div>

                        <div className="hidden lg:block mb-10">
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Sign In</h1>
                            <p className="text-slate-400 text-sm">Access your secure workspace.</p>
                        </div>

                        {/* Login Card */}
                        <div className="glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden group border border-white/10 shadow-2xl bg-white/[0.02] backdrop-blur-xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                                    <p>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                    <div className="relative group/input flex items-center">
                                        <div className="absolute left-4 text-slate-500 transition-colors group-focus-within/input:text-blue-400">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                                    <div className="relative group/input flex items-center">
                                        <div className="absolute left-4 text-slate-500 transition-colors group-focus-within/input:text-blue-400">
                                            <KeyRound size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold rounded-2xl px-4 py-4 mt-8 hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <LogIn size={18} />
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                        {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    </span>
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                </button>

                                <p className="text-center text-sm text-slate-400 mt-6">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-white hover:text-blue-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-blue-400 hover:after:w-0 after:transition-all">
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
