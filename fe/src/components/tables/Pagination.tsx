import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Previous page button handler
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Next page button handler
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-blue-600 hover:bg-blue-100'
        }`}
      >
        <ChevronLeft size={20} />
      </button>
      
      {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
        // Determine which pages to show
        let pageNum;
        if (totalPages <= 5) {
          pageNum = index + 1;
        } else if (currentPage <= 3) {
          pageNum = index + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + index;
        } else {
          pageNum = currentPage - 2 + index;
        }
        
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-md ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-blue-100'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-100'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;