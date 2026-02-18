
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@latexia/ui/components/ui/dialog';
import { Badge } from '@latexia/ui/components/ui/badge';
import { Button } from '@latexia/ui/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { toast } from '@/hooks/use-toast';
import { HighlightText } from './HighlightText';

interface LatexSymbol {
  id: number;
  name: string;
  latexCode: string;
  unicode: string | null;
  category: string;
  description: string | null;
  example: string | null;
}

interface SymbolDetailDialogProps {
  symbol: LatexSymbol | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery?: string;
}

export function SymbolDetailDialog({ symbol, open, onOpenChange, searchQuery = '' }: SymbolDetailDialogProps) {
  const [copied, setCopied] = React.useState(false);

  if (!symbol) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(symbol.latexCode);
    setCopied(true);
    toast.success(`已复制: ${symbol.latexCode}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-serif flex items-center gap-2">
                {symbol.unicode && <span className="text-3xl">{symbol.unicode}</span>}
                <span className="font-sans text-lg"><HighlightText text={symbol.name} highlight={searchQuery} /></span>
            </DialogTitle>
            <Badge variant="outline">{symbol.category}</Badge>
          </div>
          <DialogDescription>
             <HighlightText text={symbol.description || '暂无描述'} highlight={searchQuery} />
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          
          {/* Main Display */}
          <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg border min-h-[120px]">
             {symbol.unicode ? (
                <span className="text-6xl font-serif">{symbol.unicode}</span>
             ) : (
                <BlockMath math={symbol.latexCode} />
             )}
          </div>

          {/* Code Section */}
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-muted p-2 rounded text-sm font-mono text-center select-all">
                <HighlightText text={symbol.latexCode} highlight={searchQuery} />
            </code>
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Example Section */}
          {symbol.example && (
             <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none">示例</h4>
                <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded border">
                    {/* Crude way to render mixed text and math. Ideally parse it. 
                        But for now, displayed as text or simplified usage? 
                        The user provided example string "单独... $0$ ... $x^0=1$".
                        We can try to just display it as text, or regex replace $...$ with InlineMath.
                    */}
                    {symbol.example.split(/(\$[^$]+\$)/g).map((part, index) => {
                        if (part.startsWith('$') && part.endsWith('$')) {
                            return <span key={index} className="mx-1 font-serif text-foreground"><HighlightText text={part} highlight={searchQuery}/></span>;
                        }
                        return <span key={index}><HighlightText text={part} highlight={searchQuery}/></span>;
                    })}
                </div>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
