import React, { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Play, RotateCcw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

import confetti from "canvas-confetti";
const fireEmojiFirecracker = (emojis) => {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.78;

    emojis.forEach((emoji) => {
        const el = document.createElement("div");
        el.innerText = emoji;

        el.style.position = "fixed";
        el.style.left = startX + "px";
        el.style.top = startY + "px";
        el.style.fontSize = "22px";   // small start
        el.style.opacity = "0";
        el.style.zIndex = "9999";
        el.style.pointerEvents = "none";
        el.style.transform = "translate(-50%, 0) scale(0.4) rotate(0deg)";
        el.style.transition = "transform 0.9s cubic-bezier(.17,.67,.83,.67), opacity 0.9s ease";
        el.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,0.6))";

        document.body.appendChild(el);

        const angle = (Math.random() - 0.5) * 160; // wider spread
        const height = 300 + Math.random() * 200;
        const rotation = Math.random() * 720 - 360;

        // 🚀 Shoot Up Fast
        setTimeout(() => {
            el.style.opacity = "1";
            el.style.fontSize = "50px"; // medium while rising
            el.style.transform =
                `translate(calc(-50% + ${angle}px), -${height}px) scale(1.1) rotate(${rotation}deg)`;
        }, 30);

        // 🎆 Gravity Pull + Shrink
        setTimeout(() => {
            el.style.opacity = "0";
            el.style.fontSize = "18px";
            el.style.transform =
                `translate(calc(-50% + ${angle}px), ${-height + 180}px) scale(0.4) rotate(${rotation + 180}deg)`;
        }, 700);

        setTimeout(() => {
            el.remove();
        }, 1100);
    });
};

// Create ONE canvas instance globally (important)
const emojiCanvas = confetti.create(undefined, { resize: true });

const fireEmojiConfetti = (emojis, options = {}) => {
    emojis.forEach((emoji) => {
        emojiCanvas({
            ...options,
            particleCount: 6,
            spread: 100,
            startVelocity: 40,
            gravity: 1,
            ticks: 200,
            scalar: 1.2,
            shapes: ["square"],
            drawShape: function (ctx) {
                const size = 45;
                ctx.font = `${size}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(emoji, 0, 0);   // centered properly
            }
        });
    });
};

export default function QuizTab() {
    const [topic, setTopic] = useState('');
    const [text, setText] = useState('');
    const [mode, setMode] = useState('topic'); // 'topic' or 'text'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [questions, setQuestions] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // user's selected indices array
    const [shake, setShake] = useState(false);

    const playSound = (type) => {
        try {
            const url = type === 'correct'
                ? 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
                : 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3';
            const audio = new Audio(url);
            audio.volume = type === 'correct' ? 0.6 : 0.4;
            audio.play().catch(e => console.log("Audio play failed"));
        } catch (e) { }
    };

    const handleGenerate = async () => {
        if (!topic.trim() && !text.trim()) return;
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:8000/api/quiz', {
                topic: mode === 'topic' ? topic : '',
                text: mode === 'text' ? text : ''
            });

            if (res.data.study_only) {
                setError(res.data.message);
                setQuestions(null);
            } else {
                setQuestions(res.data.questions);
                setCurrentIndex(0);
                setAnswers(new Array(res.data.questions.length).fill(null));
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (index) => {
        if (answers[currentIndex] !== null) return; // already answered

        const newAnswers = [...answers];
        newAnswers[currentIndex] = index;
        setAnswers(newAnswers);

        const isCorrect = index === questions[currentIndex].correct_index;

        if (isCorrect) {
            playSound('correct');
            const defaults = { origin: { y: 0.5 }, zIndex: 1000 };

            // Native Green Confetti
            confetti({
                origin: { y: 0.5 },
                particleCount: 150,
                spread: 100,
                colors: ['#10B981', '#34D399', '#059669', '#A7F3D0'],
                zIndex: 1000
            });

           fireEmojiFirecracker(['😀','🥳','🎉','🎊','🎈']);
        } else {
            playSound('wrong');
            const defaults = { origin: { y: 0.5 }, zIndex: 1000, gravity: 1.5, scalar: 0.8 };

            // Native Red Confetti
            confetti({
                origin: { y: 0.5 },
                particleCount: 80,
                spread: 120,
                gravity: 1.5,
                colors: ['#EF4444', '#F87171', '#991B1B', '#FECACA'],
                zIndex: 1000
            });

            fireEmojiFirecracker(['💀','❌','😭','☠️']);

            if ("vibrate" in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const nextQuestion = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const startNewQuiz = () => {
        setQuestions(null);
        setCurrentIndex(0);
        setAnswers([]);
        setTopic('');
        setText('');
    };

    if (!questions) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-2xl bg-white/5/30 rounded-3xl border border-white/10/50 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="text-center mb-10 relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white mb-6 shadow-xl shadow-pink-500/20 transform -rotate-6">
                            <BrainCircuit size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-3">Quiz Generator</h2>
                        <p className="text-slate-400 max-w-md mx-auto">Test your knowledge automatically using artificial intelligence.</p>
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
                                    placeholder="e.g. History of World War I, Python OOP..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Study Material</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your notes here to generate a custom quiz..."
                                    className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition duration-200"
                                />
                            </div>
                        )}

                        {error && <div className="text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center text-sm">{error}</div>}

                        <button
                            onClick={handleGenerate}
                            disabled={loading || (mode === 'topic' ? !topic.trim() : !text.trim())}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-lg flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-pink-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} className="fill-current" />}
                            {loading ? 'Generating 5 Questions...' : 'Start Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const isAnswered = answers[currentIndex] !== null;
    const isLast = currentIndex === questions.length - 1;
    const score = answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct_index ? 1 : 0), 0);

    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col py-6">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-2xl font-bold font-mono text-slate-200 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                        Question {currentIndex + 1} <span className="text-slate-500 text-lg font-medium">/ {questions.length}</span>
                    </h2>
                </div>
                <button
                    onClick={startNewQuiz}
                    className="flex items-center text-sm text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-slate-700 px-4 py-2 rounded-full border border-white/10/50"
                >
                    <RotateCcw size={16} className="mr-2" /> Exit
                </button>
            </div>

            {/* Elegant Progress Bar */}
            <div className="w-full h-1.5 bg-[#0A0F1C]/80 rounded-full mb-8 overflow-hidden border border-white/5">
                <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="flex-1">
                <div className={`bg-white/5/40 rounded-3xl p-8 border border-white/10/50 shadow-2xl backdrop-blur-sm mb-8 relative ${shake ? 'animate-shake border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]' : ''}`}>


                    <h3 className="text-xl font-medium text-slate-100 leading-relaxed mb-8">
                        {currentQ.question}
                    </h3>

                    <div className="space-y-3">
                        {currentQ.options.map((opt, i) => {
                            const isCorrectOpt = i === currentQ.correct_index;
                            const isSelected = answers[currentIndex] === i;

                            let btnClass = "border-slate-600 bg-slate-900/50 text-slate-300 hover:bg-slate-700 hover:border-slate-500";

                            if (isAnswered) {
                                if (isCorrectOpt) {
                                    btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                                } else if (isSelected && !isCorrectOpt) {
                                    btnClass = "border-rose-500 bg-rose-500/10 text-rose-300";
                                } else {
                                    btnClass = "border-white/10 bg-white/5/50 text-slate-500 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelectOption(i)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${btnClass}`}
                                >
                                    <span className="font-medium text-lg">{opt}</span>
                                    {isAnswered && isCorrectOpt && <CheckCircle2 size={24} className="text-emerald-400" />}
                                    {isAnswered && isSelected && !isCorrectOpt && <XCircle size={24} className="text-rose-400" />}
                                    {!isAnswered && (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-slate-400 transition-colors" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {isAnswered && (
                    <div className="animate-fade-in-up">
                        <div className="bg-white/5/80 px-6 py-5 rounded-2xl border-l-4 border-indigo-500 shadow-lg text-slate-200 mb-8">
                            <p className="font-semibold text-indigo-300 mb-1 drop-shadow-sm flex items-center gap-2">Explanation</p>
                            <p className="text-[15px] leading-relaxed">{currentQ.explanation}</p>
                        </div>

                        <div className="flex justify-end">
                            {!isLast ? (
                                <button
                                    onClick={nextQuestion}
                                    className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform active:translate-y-0"
                                >
                                    Next Question <Play size={18} className="fill-current" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-lg font-bold">
                                        Score: <span className={score > 3 ? "text-emerald-400" : "text-amber-400"}>{score}</span> <span className="text-slate-500">/ {questions.length}</span>
                                    </div>
                                    <button
                                        onClick={startNewQuiz}
                                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold hover:from-pink-500 hover:to-rose-500 transition-colors shadow-lg shadow-pink-600/20"
                                    >
                                        Finish & New Quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
