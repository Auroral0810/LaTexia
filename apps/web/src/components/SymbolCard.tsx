
'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Card, CardContent, CardFooter, CardHeader } from '@latexia/ui/components/ui/card';
import { Badge } from '@latexia/ui/components/ui/badge';
import { Button } from '@latexia/ui/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@latexia/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

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
}

export const SymbolCard: React.FC<SymbolCardProps> = ({ symbol }) => {
  const [copied, setCopied] = React.useState(false);

  // Decide what to show: Unicode if available, else KaTeX
  // But user said: "主体以unicode显示即可" (Mainly display Unicode)
  // If unicode is missing, maybe fallback to KaTeX or placeholder?
  // Most symbols should have unicode now.
  const displayContent = symbol.unicode ? (
    <span className="text-4xl font-serif">{symbol.unicode}</span>
  ) : (
     <BlockMath math={symbol.latexCode} />
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(symbol.latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
      <CardHeader className="p-3 flex flex-row justify-between items-start space-y-0">
         <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground bg-muted/50">
          {symbol.category}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={handleCopy}
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy LaTeX'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 flex flex-col items-center justify-center min-h-[80px]">
        <div className="text-foreground transition-transform group-hover:scale-110 duration-200">
           {displayContent}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex flex-col items-center gap-2">
         <code className="text-xs bg-muted px-2 py-1 rounded text-primary font-mono select-all">
            {symbol.latexCode}
        </code>
        <div className="text-center w-full">
            <h3 className="font-medium text-xs text-muted-foreground truncate" title={symbol.name}>
                {symbol.name}
            </h3>
        </div>
      </CardFooter>
    </Card>
  );
};
