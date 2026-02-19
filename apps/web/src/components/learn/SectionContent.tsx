'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Copy } from 'lucide-react';
import { Button } from '@latexia/ui/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Chapter, Section } from '@/data/chapters';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SectionContentProps {
    chapter: Chapter;
    section: Section;
    chapterId: number;
    sectionId: number; // 1-indexed
    sectionIndex: number; // 0-indexed
    prevNavUrl: string | null;
    prevNavLabel: string | null;
    nextUrl: string | null;
    nextLabel: string | null;
    hasNextSection: boolean;
    nextChapterTitle?: string;
    prevSectionTitle?: string;
}

export default function SectionContent({ 
    chapter, 
    section, 
    chapterId, 
    sectionId, 
    sectionIndex,
    prevNavUrl,
    prevNavLabel,
    nextUrl,
    nextLabel,
    hasNextSection,
    nextChapterTitle,
    prevSectionTitle
}: SectionContentProps) {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success('代码已复制到剪贴板');
        setTimeout(() => setCopiedText(null), 2000);
    };

    return (
        <div className="container py-8 flex gap-8">
          {/* Sidebar: Chapter Sections List */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                 <Link href="/learn" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="font-bold text-sm text-foreground uppercase tracking-wider truncate" title={chapter.title}>
                  {chapter.title}
                </div>
              </div>
              
              <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                {chapter.sections.map((sec, idx) => {
                   const isActive = idx === sectionIndex;
                   return (
                    <Link
                      key={idx}
                      href={`/learn/${chapterId}/${idx + 1}`}
                      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`text-xs font-mono mt-0.5 ${isActive ? 'opacity-80' : 'opacity-50'}`}>{idx + 1}.</span>
                        <span>{sec.title}</span>
                      </div>
                    </Link>
                   );
                })}
              </div>
            </div>
          </div>
    
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="mb-8 border-b border-border/50 pb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Chapter {chapter.id}</span>
                <span>/</span>
                <span className="text-primary font-medium">Section {sectionId}</span>
              </div>
              <h1 className="text-3xl font-heading font-bold mb-4">{section.title}</h1>
            </div>
    

            <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Optional: Customize specific elements if needed
                  a: ({node, ...props}: any) => <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />,
                }}
              >
                {section.content}
              </ReactMarkdown>
              
              {section.code && (

                <div className="mt-8 mb-6 rounded-xl overflow-hidden border border-border bg-zinc-950 shadow-lg relative group">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <span className="text-xs font-mono text-zinc-400">LaTeX</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-zinc-400 hover:text-white"
                        onClick={() => handleCopy(section.code!)}
                      >
                        {copiedText === section.code ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                  <pre className="p-5 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-100">
                    <code>{section.code}</code>
                  </pre>
                </div>
              )}
            </div>
    
            {/* Bottom Navigation */}
            <div className="mt-8 pt-8 border-t border-border flex justify-between">
                {prevNavUrl ? (
                  <Link 
                    href={prevNavUrl}
                    className="group flex flex-col gap-2 text-left p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">{prevNavLabel}</span>
                    <span className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                      ← {prevSectionTitle || '上一节'}
                    </span>
                  </Link>
                ) : (
                    <div className="w-1"></div>
                )}
    
                {nextUrl ? (
                   <Link 
                    href={nextUrl}
                    className="group flex flex-col gap-2 text-right p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">{nextLabel}</span>
                    <span className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                      {hasNextSection ? section.title : nextChapterTitle} →
                    </span>
                  </Link>
                ) : (
                    <div className="w-1"></div>
                )}
            </div>
          </div>
          
          {/* Right Sidebar: Subsection Navigation */}
          <div className="hidden xl:block w-48 shrink-0">
            <div className="sticky top-24">
              {section.subsections && section.subsections.length > 0 && (
                <>
                  <div className="font-bold text-xs text-muted-foreground uppercase mb-4 tracking-wider">
                    本节导读
                  </div>
                  <div className="space-y-2 border-l border-border/50 pl-4">
                    {section.subsections.map((sub, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 cursor-default">
                            {sub.title}
                        </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
}
