
import React, { useState } from 'react';
import { Button } from '@latexia/ui/components/ui/button';
import { Input } from '@latexia/ui/components/ui/input';
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [jumpPage, setJumpPage] = useState('');

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const page = Number(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
               <Button
                  key={index}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => onPageChange(page)}
                  className="h-8 w-8 text-xs font-medium"
              >
                  {page}
              </Button>
          ) : (
              <span key={index} className="px-1 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
              </span>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
           className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Jump */}
      <form onSubmit={handleJump} className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">跳至</span>
        <Input 
            type="number" 
            min={1} 
            max={totalPages}
            value={jumpPage} 
            onChange={(e) => setJumpPage(e.target.value)}
            className="h-8 w-16 text-center text-xs px-1"
            placeholder="..."
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">页</span>
        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8" disabled={!jumpPage}>
            <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
