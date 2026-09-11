"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarFilters } from "@/components/sidebar-filters";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FilterParams } from "@/lib/db-repository";
import { cn } from "@/lib/utils";

export function MobileFiltersDrawer({
  currentParams,
}: {
  currentParams: FilterParams;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "fixed top-4 left-4 z-40 flex items-center gap-1.5 cursor-pointer h-9 px-3 rounded-full bg-white dark:bg-neutral-950 shadow-md border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 lg:hidden",
        )}
      >
        <ChevronRight className="size-4 text-neutral-500" />
        <span className="text-secondary">Filters</span>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-neutral-100 overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Admin panel filter options</SheetTitle>
        </SheetHeader>
        <SidebarFilters
          currentParams={currentParams}
          onApply={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
