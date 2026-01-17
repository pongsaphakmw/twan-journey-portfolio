'use client';
import { useState } from 'react';
import EditorPane from './EditorPane';
import PreviewPane from './PreviewPane';
import { ABOUT_ME_CONTENT } from '@/lib/aboutContent';

export default function VSCodeLayout() {
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

    return (
        <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
            {/* Main Content Area - Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop: Split View, Mobile: Toggle */}
                <div className={`flex-1 flex flex-col md:flex-row overflow-hidden`}>

                    {/* Editor Panel - Hidden on mobile if preview is active */}
                    <div className={`flex-1 border-r border-[#30363d] overflow-hidden ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
                        <EditorPane content={ABOUT_ME_CONTENT} />
                    </div>

                    {/* Preview Panel - Hidden on mobile if editor is active */}
                    <div className={`flex-1 overflow-hidden ${activeTab === 'editor' ? 'hidden md:block' : 'block'}`}>
                        <div className="h-full bg-[#0d1117]">
                            <PreviewPane content={ABOUT_ME_CONTENT} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Tab Toggle (Floating or Fixed) - Only visible on small screens */}
            <div className="md:hidden flex border-t border-[#30363d] bg-[#161b22]">
                <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 py-2 text-sm text-center ${activeTab === 'editor' ? 'bg-[#1f2428] text-white font-medium' : 'text-[#8b949e]'}`}
                >
                    Code
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 py-2 text-sm text-center ${activeTab === 'preview' ? 'bg-[#1f2428] text-white font-medium' : 'text-[#8b949e]'}`}
                >
                    Preview
                </button>
            </div>
        </div>
    );
}
