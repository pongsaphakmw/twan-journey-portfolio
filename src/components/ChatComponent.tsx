'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RATE_LIMIT = 10; // max messages per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// Cookie helpers
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string, maxAge: number = 3600) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

// Rate limiting helpers
const getTimestamps = (): number[] => {
    const raw = getCookie('chat_timestamps');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

const cleanOldTimestamps = (timestamps: number[]): number[] => {
    const cutoff = Date.now() - RATE_LIMIT_WINDOW;
    return timestamps.filter(ts => ts > cutoff);
};

const ChatComponent = () => {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    });
    const [input, setInput] = useState('');
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Helper function to get text content from message parts
    const getMessageText = (parts: any[]): string => {
        return parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Check rate limit
        let timestamps = cleanOldTimestamps(getTimestamps());

        if (timestamps.length >= RATE_LIMIT) {
            const oldestTs = Math.min(...timestamps);
            const waitMs = RATE_LIMIT_WINDOW - (Date.now() - oldestTs);
            const waitMins = Math.ceil(waitMs / 60000);
            setRateLimitError(`[ERROR] Rate limit exceeded. You can send ${RATE_LIMIT} messages per hour. Please wait ~${waitMins} minutes.`);
            return;
        }

        // Clear any previous error
        setRateLimitError(null);

        // Add current timestamp and save
        timestamps.push(Date.now());
        setCookie('chat_timestamps', JSON.stringify(timestamps), 3600);

        // Send message
        sendMessage({ text: input });
        setInput('');
    };

    const remainingMessages = RATE_LIMIT - cleanOldTimestamps(getTimestamps()).length;

    return (
        <div className="flex flex-col h-full text-sm font-mono text-slate-300">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
                {messages.length === 0 && (
                    <div className="text-slate-500 italic">
                        [SYSTEM] specialized_agent_loaded --version 1.0<br />
                        [SYSTEM] connection_established<br />
                        [INFO] Type a message to start interacting...<br />
                        [INFO] Rate limit: {RATE_LIMIT} messages/hour
                    </div>
                )}

                {messages.map((m: any) => (
                    <div key={m.id} className="flex flex-col space-y-1">
                        <div className="flex items-start">
                            {m.role === 'user' ? (
                                <span className="text-cyan-400 font-bold mr-2 whitespace-nowrap">USER &gt;</span>
                            ) : (
                                <span className="text-green-500 font-bold mr-2 whitespace-nowrap">[AI]</span>
                            )}
                        </div>
                        <div className={`pl-0 ${m.role === 'user' ? 'text-slate-200' : 'text-slate-300'}`}>
                            {m.role === 'user' ? (
                                <span>{getMessageText(m.parts)}</span>
                            ) : (
                                <div className="markdown-prose">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return match ? (
                                                    <div className="my-2 rounded overflow-hidden border border-slate-700 bg-[#0d1117]">
                                                        <div className="bg-slate-800 px-3 py-1 text-xs text-slate-400 border-b border-slate-700">
                                                            {match[1]}
                                                        </div>
                                                        <code className={`block whitespace-pre-wrap p-3 overflow-x-auto ${className}`} {...props}>
                                                            {children}
                                                        </code>
                                                    </div>
                                                ) : (
                                                    <code className="bg-slate-800 px-1 py-0.5 rounded text-orange-300" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                                            p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>,
                                        }}
                                    >
                                        {getMessageText(m.parts)}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {rateLimitError && (
                    <div className="text-red-400 font-bold">
                        {rateLimitError}
                    </div>
                )}

                {status === 'streaming' && (
                    <div className="flex items-center text-green-500 animate-pulse">
                        <span className="mr-2">[AI]</span>
                        <span>⠋ thinking...</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSubmit}
                className="flex items-center px-4 py-3 bg-[#161b22] border-t border-slate-700"
            >
                <span className="text-green-500 mr-2">➜</span>
                <span className="text-cyan-400 mr-2">ai@chat:~$</span>
                <input
                    className="flex-1 bg-transparent focus:outline-none text-slate-300 font-mono placeholder-slate-600"
                    value={input}
                    placeholder={`Say something... (${remainingMessages} left)`}
                    onChange={e => setInput(e.currentTarget.value)}
                    disabled={status !== 'ready'}
                    autoFocus
                />
            </form>
        </div>
    );
};

export default ChatComponent;
