import React, { useMemo } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const sndButtonClass = "px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50";

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const delta = 1;

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 text-sm md:text-base">
      <button disabled={currentPage === 1} onClick={() => goToPage(1)} className={sndButtonClass}>
        First
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="hidden md:flex px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
      >
        Back
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 rounded-lg ${
            page === currentPage ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="hidden md:flex px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>

      <button disabled={currentPage === totalPages} onClick={() => goToPage(totalPages)} className={sndButtonClass}>
        Last
      </button>
    </div>
  );
};

export default Pagination;
