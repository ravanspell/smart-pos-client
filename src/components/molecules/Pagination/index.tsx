import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  totalRecords: number; // Total number of records
  itemsPerPage: number; // Number of items shown per page
  currentPage: number; // Currently active page
  onPageChange: (page: number) => void; // Function to handle page change
  siblingsCount?: number; // Number of siblings to show on each side of current page
  showFirstAndLast?: boolean; // Whether to always show first and last page
}

// The ellipsis marker
const ELLIPSIS = "ellipsis";

export function CustomPagination({
  totalRecords,
  itemsPerPage,
  currentPage,
  onPageChange,
  siblingsCount = 1,
  showFirstAndLast = true,
}: CustomPaginationProps) {
  // Calculate total pages based on records and items per page
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  }, [totalRecords, itemsPerPage]);
  
  // Validate current page is within bounds
  const validatedCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, totalPages));
  }, [currentPage, totalPages]);
  
  // Hide pagination if there's only one page
  if (totalPages <= 1) return null;

  // Function to generate the page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // For small number of pages, show all without ellipsis
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    const leftSiblingIndex = Math.max(validatedCurrentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(validatedCurrentPage + siblingsCount, totalPages);
    
    // Whether to show ellipsis and first/last page buttons
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Always show first page if requested
    if (showFirstAndLast && shouldShowLeftDots) {
      pages.push(1);
      pages.push(ELLIPSIS);
    }
    
    // Generate the main page numbers
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }
    
    // Always show last page if requested
    if (showFirstAndLast && shouldShowRightDots) {
      pages.push(ELLIPSIS);
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page !== validatedCurrentPage) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => validatedCurrentPage > 1 && handlePageChange(validatedCurrentPage - 1)}
            className={validatedCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={validatedCurrentPage === 1}
          />
        </PaginationItem>
        
        {/* Page Numbers with Ellipsis */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={`page-${index}`}>
            {page === ELLIPSIS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageChange(page as number)}
                isActive={validatedCurrentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => validatedCurrentPage < totalPages && handlePageChange(validatedCurrentPage + 1)}
            className={validatedCurrentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={validatedCurrentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}