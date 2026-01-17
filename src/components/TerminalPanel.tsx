'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processCommand } from '@/utils/terminalCommand';
import ChatComponent from './ChatComponent';

interface TerminalPanelProps {
    isMinimized: boolean;
    onMinimizeChange: (isMinimized: boolean) => void;
}

const TerminalPanel = ({ isMinimized, onMinimizeChange }: TerminalPanelProps) => {
    const [activeTab, setActiveTab] = useState('TERMINAL');
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([
        '➜  visitor@portfolio:~$ init_session --guest',
        '   [INFO] Environment loaded. Welcome to the interactive portfolio.',
        '',
    ]);
    const router = useRouter();

    const quickChips = [
        { label: 'Help', command: 'help' },
        { label: 'Getting Started', command: 'start' },
        { label: 'Contact', command: 'contact' },
    ];

    const toggleMinimize = () => {
        onMinimizeChange(!isMinimized);
    };

    const executeCommand = (cmd: string) => {
        // Always echo the command first
        setLogs((prev) => [...prev, `➜ visitor@portfolio:~$ ${cmd}`]);

        const result = processCommand(cmd);

        if (result.shouldClear) {
            setLogs([]);
        } else if (result.output.length > 0) {
            setLogs((prev) => [...prev, ...result.output]);
        }

        if (result.navigationPath) {
            router.push(result.navigationPath);
        }

        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeCommand(input.trim());
        }
    };

    const tabs = ['TERMINAL', 'CHAT'];

    return (
        <div className="flex flex-col h-full bg-[#0d1117] border-t border-slate-700 text-slate-300 font-mono text-sm">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 bg-[#161b22] border-b border-slate-700">
                <ul className="flex space-x-1">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            className={`px-3 py-2 cursor-pointer uppercase text-xs font-medium tracking-wide transition-colors ${activeTab === tab
                                ? 'text-white border-b-2 border-orange-400 bg-[#0d1117]'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                {/* Window Controls */}
                <div className="flex items-center space-x-2 text-slate-500">
                    <button
                        onClick={toggleMinimize}
                        className="hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
                        title={isMinimized ? 'Expand' : 'Minimize'}
                    >
                        <span className={`inline-block transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`}>
                            v
                        </span>
                    </button>
                </div>
            </div>

            {/* Body - hidden when minimized */}
            {!isMinimized && (
                <div className="flex-1 overflow-hidden relative">
                    {/* Terminal - always mounted, hidden when not active */}
                    <div className={`flex flex-col h-full ${activeTab !== 'TERMINAL' ? 'hidden' : ''}`}>
                        {/* Terminal Logs */}
                        <div className="flex-1 p-4 overflow-y-auto font-mono bg-black/30">
                            <div className="flex flex-col space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i} className="whitespace-pre-wrap">{log}</div>
                                ))}
                            </div>

                            {/* Quick Chips */}
                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                                <p className="text-slate-500 text-xs mb-3 uppercase tracking-wide">[ Suggested Commands ]:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickChips.map((chip) => (
                                        <button
                                            key={chip.command}
                                            onClick={() => executeCommand(chip.command)}
                                            className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-600 hover:border-orange-400 transition-all duration-200"
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Terminal Input */}
                        <div className="flex items-center px-4 py-3 bg-[#161b22] border-t border-slate-700">
                            <span className="text-green-500 mr-2">➜</span>
                            <span className="text-cyan-400 mr-2">visitor@portfolio:~$</span>
                            <input
                                type="text"
                                className="flex-1 bg-transparent focus:outline-none text-slate-300 font-mono"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                spellCheck={false}
                                placeholder="Type a command..."
                            />
                        </div>
                    </div>

                    {/* Chat - always mounted, hidden when not active */}
                    <div className={`h-full ${activeTab !== 'CHAT' ? 'hidden' : ''}`}>
                        <ChatComponent />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TerminalPanel;
