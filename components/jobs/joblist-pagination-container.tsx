"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useFilter } from "../../hooks/use-filter";

type JobListPaginationContainerProps = {
  totalCount: number;
  siblingCount?: number;
  pageSize: number;
};

export const JobListPaginationContainer = (
  props: JobListPaginationContainerProps
) => {
  const { totalCount, siblingCount = 1, pageSize } = props;
  const { currentPage, handlePaginate } = useFilter();

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (!paginationRange || paginationRange.length < 2) {
    return null;
  }

  const lastPage = paginationRange[paginationRange.length - 1] as number;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === lastPage;

  const onPageChange = (pageNumber: number) => {
    handlePaginate(pageNumber);
  };

  return (
    <section id="paginate" className="px-[5%] pb-4 md:pb-8 lg:pb-16">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {!isFirstPage && (
              <PaginationPrevious
                size="default"
                className="cursor-pointer"
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Go to previous page"
              />
            )}
          </PaginationItem>

          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === "DOTS") {
              return (
                <PaginationItem key={`dots-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const pageNum = pageNumber as number;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  size="default"
                  className="cursor-pointer"
                  onClick={() => onPageChange(pageNum)}
                  isActive={pageNum === currentPage}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={pageNum === currentPage ? "page" : undefined}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {!isLastPage && (
              <PaginationNext
                size="default"
                className="cursor-pointer"
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Go to next page"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};
