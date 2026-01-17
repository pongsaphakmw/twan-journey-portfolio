'use client';

import React, { useState } from 'react';
import TerminalPanel from './TerminalPanel';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);

    return (
        <>
            {/* Main Canvas Area - expands when terminal is minimized */}
            <main
                className={`w-full overflow-auto relative border-b border-slate-700 pt-14 transition-all duration-300 ${isTerminalMinimized ? 'flex-1' : 'h-[65%]'
                    }`}
            >
                {children}
            </main>

            {/* Terminal Panel Area - collapses to header only when minimized */}
            <footer
                className={`w-full relative z-50 bg-[#0d1117] border-t border-slate-700 transition-all duration-300 ${isTerminalMinimized ? 'h-10' : 'h-[35%]'
                    }`}
            >
                <TerminalPanel
                    isMinimized={isTerminalMinimized}
                    onMinimizeChange={setIsTerminalMinimized}
                />
            </footer>
        </>
    );
};

export default MainLayout;
