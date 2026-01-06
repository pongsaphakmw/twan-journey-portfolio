'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen p-8 pt-24 max-w-2xl mx-auto text-slate-200">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-cyan-400">Get In Touch</h1>
                <p className="text-slate-400">
                    Have a question or want to work together? Send me a message!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-300">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                        placeholder="Project Inquiry"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none placeholder:text-slate-600"
                        placeholder="Tell me about your project..."
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-all duration-300 ${status === 'success'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-cyan-600 hover:bg-cyan-700 text-white hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : status === 'success' ? (
                            <>
                                Message Sent Successfully!
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Message
                            </>
                        )}
                    </button>
                    {status === 'error' && (
                        <p className="text-red-400 text-sm mt-3 text-center bg-red-950/30 p-2 rounded border border-red-900/50">
                            {errorMessage || 'Failed to send message. Please try again.'}
                        </p>
                    )}
                    {status === 'success' && (
                        <p className="text-green-400 text-sm mt-3 text-center">
                            I'll get back to you as soon as possible.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
