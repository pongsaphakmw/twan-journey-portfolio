'use client';

import React, { useState, useRef, useEffect } from 'react';

const TerminalPanel = () => {
    const [activeTab, setActiveTab] = useState('TERMINAL');
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([
        'Welcome to the portfolio terminal.',
        'Type "help" for a list of commands.',
    ]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            setLogs((prev) => [...prev, `➜ visitor@portfolio:~$ ${cmd}`]);

            if (cmd === 'help') {
                setLogs((prev) => [...prev, 'Available commands: help, clear, about, work, contact']);
            } else if (cmd === 'clear') {
                setLogs([]);
            } else if (cmd) {
                setLogs((prev) => [...prev, `Command not found: ${cmd}`]);
            }

            setInput('');
        }
    };

    const tabs = ['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL', 'PORTS'];

    return (
        <div className="flex flex-col h-full bg-[#0d1117] border-t border-slate-700 text-slate-300 font-mono text-sm">
            {/* Header / Tabs */}
            <div className="flex items-center px-4 bg-[#0d1117] border-b border-slate-700">
                <ul className="flex space-x-6">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            className={`py-2 cursor-pointer uppercase text-xs font-bold tracking-wide ${activeTab === tab
                                    ? 'text-white border-b-2 border-orange-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Body / Logs */}
            <div className="flex-1 p-4 overflow-y-auto font-mono">
                <div className="flex flex-col space-y-1">
                    {logs.map((log, i) => (
                        <div key={i} className="whitespace-pre-wrap">{log}</div>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="flex items-center px-4 py-2 bg-[#0d1117]">
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
                />
            </div>
        </div>
    );
};

export default TerminalPanel;
