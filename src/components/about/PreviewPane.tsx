'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewPaneProps {
    content: string;
}

export default function PreviewPane({ content }: PreviewPaneProps) {
    return (
        <div className="h-full bg-[#0d1117] overflow-auto custom-scrollbar p-8">
            <div className="prose prose-invert max-w-none prose-headings:border-b prose-headings:border-[#30363d] prose-headings:pb-2 prose-a:text-blue-400 prose-code:text-[#c9d1d9] prose-code:bg-[#161b22] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
