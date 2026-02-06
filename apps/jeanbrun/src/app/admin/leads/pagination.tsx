"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        {totalItems} resultat{totalItems !== 1 ? "s" : ""}
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages} ({totalItems} resultat
        {totalItems !== 1 ? "s" : ""})
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isPending}
          onClick={() => goToPage(currentPage - 1)}
        >
          Precedent
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages || isPending}
          onClick={() => goToPage(currentPage + 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
