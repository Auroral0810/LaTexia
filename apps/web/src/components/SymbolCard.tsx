
'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Card, CardContent, CardFooter, CardHeader } from '@latexia/ui/components/ui/card';
import { Badge } from '@latexia/ui/components/ui/badge';
import { Button } from '@latexia/ui/components/ui/button';
import { Copy, Check, Maximize2 } from 'lucide-react';
import { cn } from '@latexia/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { HighlightText } from './HighlightText';
import { toast } from '@/hooks/use-toast';

interface LatexSymbol {
  id: number;
  name: string;
  latexCode: string;
  unicode: string | null;
  category: string;
  description: string | null;
  example: string | null;
}

interface SymbolCardProps {
  symbol: LatexSymbol;
  searchQuery?: string;
  onClick?: () => void;
}

export const SymbolCard: React.FC<SymbolCardProps> = ({ symbol, searchQuery = '', onClick }) => {
  const [copied, setCopied] = React.useState(false);

  const displayContent = symbol.unicode ? (
    <span className="text-3xl font-serif">{symbol.unicode}</span>
  ) : (
     <BlockMath math={symbol.latexCode} />
  );

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(symbol.latexCode);
    setCopied(true);
    toast.success(`已复制: ${symbol.latexCode}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card 
        className="hover:border-primary/50 transition-all duration-300 hover:shadow-md group flex flex-col justify-between h-full bg-card/50 backdrop-blur-sm cursor-pointer relative"
        onClick={onClick}
    >
      <CardHeader className="p-2 flex flex-row justify-between items-start space-y-0 relative">
         <Badge variant="outline" className="text-[9px] uppercase text-muted-foreground bg-muted/50 px-1 py-0 h-5">
          {symbol.category.slice(0, 3)}
        </Badge>
        <div className="flex items-center gap-1 absolute right-1 top-1">
             <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-6 w-6 transition-opacity",
                  copied ? "opacity-100 text-green-500" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={handleCopy}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 flex flex-col items-center justify-center min-h-[60px] grow">
        <div className="text-foreground transition-transform group-hover:scale-110 duration-200">
           {displayContent}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex flex-col items-center gap-1.5 w-full overflow-hidden">
         <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-primary font-mono select-all max-w-full truncate block">
            <HighlightText text={symbol.latexCode} highlight={searchQuery} />
        </code>
        <div className="text-center w-full truncate">
            <h3 className="font-medium text-[10px] text-muted-foreground truncate" title={symbol.name}>
                <HighlightText text={symbol.name} highlight={searchQuery} />
            </h3>
        </div>
      </CardFooter>
    </Card>
  );
};
