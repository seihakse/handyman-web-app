// components/ui/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  
  // Generate page numbers
  for (let i = 1; i <= Math.min(5, totalPages); i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-between items-center">
      <p className="text-gray-500 text-sm">
        Showing 1 to 5 of 23 pending approvals
      </p>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronLeft size={16} />
        </button>
        
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {totalPages > 5 && (
          <>
            <span className="px-2 flex items-center">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}