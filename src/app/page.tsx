import React from 'react';
import { Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <div className="p-8 border border-slate-700 rounded-lg bg-[#161b22] shadow-xl">
        <div className="flex justify-center mb-4">
          <Code2 size={48} className="text-orange-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2 font-mono">Main Canvas</h1>
        <p className="text-sm">Click the TopNav links to navigate or use the terminal below.</p>
        <div className="mt-6 p-4 bg-black/30 rounded text-xs font-mono">
          <p className="text-green-400">// TODO: Implement portfolio sections</p>
          <p className="text-blue-400">src/app/page.tsx</p>
        </div>
      </div>
    </div>
  );
}
