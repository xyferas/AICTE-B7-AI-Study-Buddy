import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setError('');
            await register(name, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#0A0F1C]">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '9s' }} />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '11s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-[420px] px-6 py-12">
                {/* Logo area */}
                <div className="flex flex-col items-center justify-center mb-10 animate-float">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.3)] backdrop-blur-xl mb-6">
                        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl"></div>
                        <GraduationCap size={40} className="text-violet-400 relative z-10" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                    <p className="text-slate-400 text-center">Join your intelligent study workspace today</p>
                </div>

                {/* Register Card */}
                <div className="glass-panel rounded-3xl p-8 pt-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-80" />

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold rounded-2xl px-4 py-4 mt-4 hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <UserPlus size={18} />
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-1" />}
                            </span>
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-100 to-white opacity-0 group-hover:opacity-10 transition-opacity" />
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white font-medium hover:text-violet-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-violet-400 hover:after:w-0 after:transition-all">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
