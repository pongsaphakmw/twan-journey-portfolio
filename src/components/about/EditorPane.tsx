'use client';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('markdown', markdown);

interface EditorPaneProps {
    content: string;
}

export default function EditorPane({ content }: EditorPaneProps) {
    return (
        <div className="h-full bg-[#1e1e1e] overflow-auto custom-scrollbar text-[14px]">
            <SyntaxHighlighter
                language="markdown"
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: 'transparent',
                    fontSize: '14px',
                    lineHeight: '1.5',
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    color: '#858585',
                    textAlign: 'right',
                }}
                wrapLines={true}
            >
                {content}
            </SyntaxHighlighter>
        </div>
    );
}
