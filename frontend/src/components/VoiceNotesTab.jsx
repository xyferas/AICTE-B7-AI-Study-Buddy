import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Mic, FileAudio, Loader2, PlayCircle, CheckCircle2, ChevronRight, Save, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function VoiceNotesTab() {
    const [file, setFile] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    const handleSave = async () => {
        if (!summary) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            // Extract a title string from the raw transcript.
            let titleSource = transcript ? transcript : summary;
            await axios.post('http://localhost:8000/api/saved-content', {
                content_type: 'notes',
                title: titleSource.substring(0, 40) + (titleSource.length > 40 ? '...' : ''),
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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Limit file size to 10MB (10 * 1024 * 1024 bytes)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size exceeds the 10MB limit. Please upload a smaller audio file.');
                setFile(null);
                setTranscript('');
                setSummary('');
                return;
            }

            setFile(selectedFile);
            setTranscript('');
            setSummary('');
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoadingAudio(true);
        setError('');

        const formData = new FormData();
        formData.append('audio', file);

        try {
            const res = await axios.post('http://localhost:8000/api/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const transcribedText = res.data.transcript;
            setTranscript(transcribedText);
            generateSummary(transcribedText);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to transcribe audio. Check your HF_TOKEN.');
            setLoadingAudio(false);
        }
    };

    const generateSummary = async (textToSummarize) => {
        setLoadingSummary(true);
        try {
            const res = await axios.post('http://localhost:8000/api/summarize', { text: textToSummarize });
            setSummary(res.data.summary);
        } catch (err) {
            setError('Audio transcribed, but failed to summarize: ' + (err.response?.data?.detail || err.message));
        } finally {
            setLoadingAudio(false);
            setLoadingSummary(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Upload Section */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-[#0A0F1C]/40 rounded-3xl border border-white/10 backdrop-blur-2xl glass-panel p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-2 relative z-10">
                        <Mic className="text-indigo-400" size={24} />
                        Voice to Notes
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 relative z-10">Upload a lecture recording to get a strict academic transcript and summary notes.</p>

                    <div
                        onClick={() => !loadingAudio && fileInputRef.current?.click()}
                        className={`border-2 border-dashed ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-600 hover:border-indigo-400/70 hover:bg-white/5/80'} rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative z-10 mb-6`}
                    >
                        {file ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 ring-1 ring-indigo-500/40">
                                    <CheckCircle2 size={32} />
                                </div>
                                <p className="font-semibold text-slate-200">{file.name}</p>
                                <p className="text-xs text-slate-400 mt-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                                    <FileAudio size={32} />
                                </div>
                                <p className="font-medium text-slate-300">Click to upload lecture audio</p>
                                <p className="text-xs text-slate-500 mt-2">MP3, WAV, M4A up to 25MB</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".mp3,.wav,.m4a"
                            className="hidden"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || loadingAudio}
                        className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 transform transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                    >
                        {loadingAudio ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                        {loadingAudio ? 'Uploading & Transcribing...' : 'Process Audio'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Transcript Accordion */}
                {transcript && (
                    <div className="bg-white/5/30 border border-white/10/50 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-[250px]">
                        <div className="bg-white/5/80 px-4 py-3 border-b border-white/10/50 flex justify-between items-center">
                            <h4 className="font-medium text-slate-200 text-sm">Raw Transcript</h4>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                            {transcript}
                        </div>
                    </div>
                )}
            </div>

            {/* Output Section */}
            <div className="flex-[1.5] bg-[#0A0F1C]/40 rounded-3xl border border-white/10 backdrop-blur-2xl glass-panel overflow-hidden shadow-xl flex flex-col">
                <div className="px-6 py-4 border-b border-white/10/50 bg-white/5/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <ChevronRight size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Generated Notes</h3>
                    </div>

                    {summary && !summary.includes("study purposes only") && (
                        <button
                            onClick={handleSave}
                            disabled={isSaving || saved}
                            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                            {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Saved!' : 'Save'}
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {loadingSummary ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-indigo-400">
                            <Loader2 size={40} className="animate-spin" />
                            <p className="font-medium">Turning transcript into concise notes...</p>
                        </div>
                    ) : summary ? (
                        <div className={`prose prose-invert max-w-none ${summary.includes("study purposes only") ? 'text-amber-400' : 'text-slate-200'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-white/5/50 flex items-center justify-center border border-white/10">
                                <FileAudio size={28} className="text-slate-600" />
                            </div>
                            <p>Upload audio to see structured notes here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
