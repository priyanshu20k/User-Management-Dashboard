// PaginationControls.jsx - Footer page selectors and page size settings.

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function PaginationControls({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  
  // keep the page index within safe bounds
  const currPage = Math.min(page, totalPages);

  const startItem = total === 0 ? 0 : (currPage - 1) * limit + 1;
  const endItem = Math.min(currPage * limit, total);

  // calculate page numbers list to display
  const makePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = makePageNumbers();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 bg-white px-6 py-5">
      {/* showing count message and dropdown */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <div>
          Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900">{total}</span> entries
        </div>
        
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <label htmlFor="limit-select" className="text-xs font-medium text-gray-400 uppercase tracking-wider">Show</label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          >
            <option value="10">10 entries</option>
            <option value="25">25 entries</option>
            <option value="50">50 entries</option>
            <option value="100">100 entries</option>
          </select>
        </div>
      </div>

      {/* standard button bar controls */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
          {/* jump to first */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currPage === 1}
            className="hidden sm:inline-flex rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition"
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* previous */}
          <button
            type="button"
            onClick={() => onPageChange(currPage - 1)}
            disabled={currPage === 1}
            className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* numbered list buttons */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  currPage === 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                1
              </button>
              {pageNumbers[0] > 2 && <span className="px-1 text-gray-400 text-xs font-medium">...</span>}
            </>
          )}

          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`inline-flex items-center justify-center rounded-lg min-w-9 px-3 py-1.5 text-sm font-medium transition ${
                currPage === p
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {p}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-1 text-gray-400 text-xs font-medium">...</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  currPage === totalPages
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* next page button */}
          <button
            type="button"
            onClick={() => onPageChange(currPage + 1)}
            disabled={currPage === totalPages}
            className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* jump to last page */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currPage === totalPages}
            className="hidden sm:inline-flex rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition"
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}