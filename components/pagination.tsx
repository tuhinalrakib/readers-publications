import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const t = useTranslations("pagination");

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 1) {
      return [1];
    }

    // Always show first page
    pageNumbers.push(1);

    // Calculate the range to show 5 pages including current, previous, next
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    // Adjust start and end to ensure we show 5 pages when possible
    if (end - start < 2) {
      if (start === 1) {
        end = Math.min(totalPages, start + 2);
      } else if (end === totalPages) {
        start = Math.max(1, end - 2);
      }
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pageNumbers.push("...");
    }

    // Add pages in range
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <nav
        className="flex items-center space-x-1"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className="flex items-center gap-1"
          aria-label={t("previous") || "Previous page"}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("previous")}</span>
        </Button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-gray-400"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                className="w-10 h-10 p-0"
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-1"
          aria-label={t("next") || "Next page"}
        >
          <span className="hidden sm:inline">{t("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}