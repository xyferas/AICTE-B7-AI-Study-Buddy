import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Play, RotateCcw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FlashcardsTab() {
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [mode, setMode] = useState('topic'); // 'topic' or 'text'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [flashcards, setFlashcards] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Swipe tracking
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX);
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            nextCard();
        } else if (isRightSwipe) {
            prevCard();
        }
    }

    const handleGenerate = async () => {
        if (!topic.trim() && !text.trim()) return;
        setLoading(true);
        setError('');
        setFlashcards(null);
        setCurrentIndex(0);
        setIsFlipped(false);

        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        try {
            const res = await axios.post(`${API_URL}/api/flashcards`, {
                topic: mode === 'topic' ? topic : '',
                text: mode === 'text' ? text : ''
            });

            if (res.data.study_only) {
                setError(res.data.message);
                setFlashcards(null);
            } else {
                setFlashcards(res.data.flashcards);
                setCurrentIndex(0);
                setIsFlipped(false);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate flashcards');
        } finally {
            setLoading(false);
        }
    };

    const startNewDeck = () => {
        setFlashcards(null);
        setCurrentIndex(0);
        setIsFlipped(false);
        setTopic('');
        setText('');
    };

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 150);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
            }, 150);
        }
    };

    // FORM VIEW
    if (!flashcards) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-2xl bg-white/5/30 rounded-3xl border border-white/10/50 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="text-center mb-10 relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-6 shadow-xl shadow-amber-500/20 transform rotate-3">
                            <Layers size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-3">Flashcards</h2>
                        <p className="text-slate-400 max-w-md mx-auto">Generate interactive flashcards from your study materials for active recall.</p>
                    </div>

                    <div className="flex gap-4 mb-8 bg-slate-900/50 p-1.5 rounded-xl border border-white/10/50 relative z-10 w-max mx-auto">
                        <button
                            onClick={() => setMode('topic')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'topic' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            By Topic
                        </button>
                        <button
                            onClick={() => setMode('text')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'text' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            By Text
                        </button>
                    </div>

                    <div className="space-y-6 relative z-10">
                        {mode === 'topic' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Subject / Topic</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Capital Cities, Chemistry Elements..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Study Material</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your notes here to generate flashcards..."
                                    className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition duration-200"
                                />
                            </div>
                        )}

                        {error && <div className="text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center text-sm">{error}</div>}

                        <button
                            onClick={handleGenerate}
                            disabled={loading || (mode === 'topic' ? !topic.trim() : !text.trim())}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-lg flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} className="fill-current" />}
                            {loading ? 'Generating 10 Flashcards...' : 'Create Deck'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // FLASHCARD VIEW
    const currentCard = flashcards[currentIndex];

    // Minimal inline CSS for 3D flip card effect
    const flipContainerStyle = {
        perspective: '1000px',
        width: '100%',
        maxWidth: '32rem', // max-w-lg
        aspectRatio: '3 / 2',
        cursor: 'pointer',
    };

    const flipperStyle = {
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    };

    const baseSideStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden', // for Safari
        borderRadius: '1.5rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    };

    const frontStyle = {
        ...baseSideStyle,
        background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)', // Match slate-900 vibes
        zIndex: 2,
    };

    const backStyle = {
        ...baseSideStyle,
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.15) 100%)',
        backdropFilter: 'blur(16px)',
        transform: 'rotateY(180deg)',
    };

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col py-6 items-center justify-center">

            <div className="w-full flex justify-between items-center mb-10 px-4 max-w-2xl">
                <div>
                    <h2 className="text-2xl font-bold font-mono text-slate-200 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                        Card {currentIndex + 1} <span className="text-slate-500 text-lg font-medium">/ {flashcards.length}</span>
                    </h2>
                </div>
                <button
                    onClick={startNewDeck}
                    className="flex items-center text-sm text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-slate-700 px-4 py-2 rounded-full border border-white/10/50"
                >
                    <RotateCcw size={16} className="mr-2" /> Exit
                </button>
            </div>

            {/* The 3D Flip Card */}
            <div
                style={flipContainerStyle}
                className="group relative"
                onClick={() => setIsFlipped(!isFlipped)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div style={flipperStyle}>
                    {/* FRONT OF CARD */}
                    <div style={frontStyle} className="group-hover:border-amber-500/50 transition-colors">
                        <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-slate-500 uppercase">Question / Term</span>
                        <h3 className="text-3xl font-medium text-slate-100 leading-tight text-center">
                            {currentCard.front}
                        </h3>
                        <span className="absolute bottom-6 text-xs text-slate-500 font-medium">Tap to flip ↺</span>
                    </div>

                    {/* BACK OF CARD */}
                    <div style={backStyle} className="border-amber-500/30">
                        <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-amber-500 uppercase">Answer</span>
                        <h3 className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed text-center">
                            {currentCard.back}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-12 w-full max-w-lg px-4">
                <button
                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    <ChevronLeft size={28} />
                </button>

                <div className="flex-1 text-center font-medium text-slate-500">
                    Swipe to navigate
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                    disabled={currentIndex === flashcards.length - 1}
                    className="p-4 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

        </div>
    );
}
