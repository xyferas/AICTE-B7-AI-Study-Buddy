import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#0A0F1C]">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] -left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-600/15 blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-[420px] px-6">
                {/* Header container with back link */}
                <div className="mb-6 flex">
                    <Link to="/login" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl">
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Logo area */}
                <div className="flex flex-col items-center justify-center mb-10 animate-float">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-xl mb-6">
                        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl"></div>
                        <KeyRound size={36} className="text-emerald-400 relative z-10" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
                    <p className="text-slate-400 text-center text-sm md:text-base">Enter your email and we'll send a link to reset your password</p>
                </div>

                {/* Form Card */}
                <div className="glass-panel rounded-3xl p-8 pt-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-80" />

                    {submitted ? (
                        <div className="py-6 flex flex-col items-center text-center animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 ring-1 ring-emerald-500/30">
                                <Send size={28} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Check your inbox</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                If an account exists for <span className="text-white font-medium">{email}</span>, we've sent instructions to reset your password.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold rounded-2xl px-4 py-4 mt-2 hover:bg-slate-100 transition-all active:scale-[0.98] overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Send Reset Link
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
