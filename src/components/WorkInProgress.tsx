'use client';
import { Construction, Wrench, Clock, Sparkles } from 'lucide-react';

const WorkInProgress = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            {/* Animated construction icon */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
                    <Construction
                        size={80}
                        className="text-orange-400 animate-bounce"
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 text-center">
                Work in Progress
            </h2>

            {/* Subtitle */}
            <p className="text-slate-400 text-lg text-center max-w-md mb-8">
                This section is currently under construction.
                Check back soon for exciting updates!
            </p>

            {/* Status indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                    <Wrench size={16} className="text-blue-400" />
                    <span className="text-sm text-slate-300">Building</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-sm text-slate-300">Coming Soon</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                    <Sparkles size={16} className="text-purple-400" />
                    <span className="text-sm text-slate-300">Stay Tuned</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>Loading...</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-full animate-pulse"
                        style={{
                            width: '60%',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s ease-in-out infinite, pulse 2s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkInProgress;
