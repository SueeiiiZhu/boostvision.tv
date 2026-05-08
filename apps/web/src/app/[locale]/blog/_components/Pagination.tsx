import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // e.g., "/blog" or "/blog/news"
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl; // First page has no /page suffix
    }
    return `${baseUrl}/page/${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const renderMobilePageNumbers = () => {
    if (totalPages <= 1) return [1];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [1];

    if (currentPage > 2) pages.push(-1);
    if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
    if (currentPage < totalPages - 1) pages.push(-2);

    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          scroll={false}
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-heading transition-all hover:border-primary hover:text-primary card-shadow"
          aria-label="Previous page"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {/* Page Numbers - Mobile */}
      <div className="flex items-center gap-1.5 sm:hidden">
        {renderMobilePageNumbers().map((page, index) => {
          if (page === -1 || page === -2) {
            return (
              <span key={`ellipsis-mobile-${index}`} className="flex h-10 w-10 items-center justify-center text-muted">
                ...
              </span>
            );
          }

          return (
            <Link
              key={`mobile-${page}`}
              href={getPageUrl(page)}
              scroll={false}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold transition-all",
                currentPage === page
                  ? "bg-primary text-white shadow-lg"
                  : "border border-gray-200 bg-white text-heading hover:border-primary hover:text-primary card-shadow"
              )}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Page Numbers - Desktop */}
      <div className="hidden items-center gap-2 sm:flex">
        {renderPageNumbers().map((page, index) => {
          if (page === -1 || page === -2) {
            return (
              <span key={`ellipsis-${index}`} className="flex h-12 w-12 items-center justify-center text-muted">
                ...
              </span>
            );
          }

          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              scroll={false}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-[16px] font-bold transition-all",
                currentPage === page
                  ? "bg-primary text-white shadow-lg"
                  : "border border-gray-200 bg-white text-heading hover:border-primary hover:text-primary card-shadow"
              )}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          scroll={false}
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-heading transition-all hover:border-primary hover:text-primary card-shadow"
          aria-label="Next page"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}
