'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatComponent = () => {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    });
    const [input, setInput] = useState('');
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
                        [INFO] Type a message to start interacting...
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

                {status === 'streaming' && (
                    <div className="flex items-center text-green-500 animate-pulse">
                        <span className="mr-2">[AI]</span>
                        <span>⠋ thinking...</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) {
                        sendMessage({ text: input });
                        setInput('');
                    }
                }}
                className="flex items-center px-4 py-3 bg-[#161b22] border-t border-slate-700"
            >
                <span className="text-green-500 mr-2">➜</span>
                <span className="text-cyan-400 mr-2">ai@chat:~$</span>
                <input
                    className="flex-1 bg-transparent focus:outline-none text-slate-300 font-mono placeholder-slate-600"
                    value={input}
                    placeholder="Say something..."
                    onChange={e => setInput(e.currentTarget.value)}
                    disabled={status !== 'ready'}
                    autoFocus
                />
            </form>
        </div>
    );
};

export default ChatComponent;
