import { Suspense } from "react";
import { getPaginatedProviders, FilterParams } from "@/lib/db-repository";
import { ProvidersTable } from "@/components/providers-table";
import { SidebarFilters } from "@/components/sidebar-filters";
import { MobileFiltersDrawer } from "@/components/mobile-filters-drawer";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<FilterParams>;
}

export default async function WaitlistPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getPaginatedProviders(params);

  return (
    <div className="flex min-h-screen bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-50 flex-col lg:flex-row relative">
      {/* 1. Mobile-only Floating Drawer Triggers Context */}
      <MobileFiltersDrawer currentParams={params} />

      {/* 2. Desktop-only Persistent Left Side Panel */}
      <aside className="w-80 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 hidden lg:block">
        <SidebarFilters currentParams={params} />
      </aside>

      {/* 3. Primary Core Working Dashboard Workspace Container */}
      <main className="flex-1 p-4 pt-16 sm:p-8 space-y-4 overflow-x-hidden w-full">
        <div className="flex flex-col gap-4 w-full md:mt-10 lg:mt-0">
          <div className="flex justify-between">
            <h1 className="text-3xl tracking-wide">Waitlist</h1>
            <div className="flex lg:hidden gap-4">
              <Button
                variant={"default"}
                size={"xs"}
                className="bg-neutral-300 text-foreground rounded-full"
              >
                Service Providers
              </Button>
              <Button variant={"outline"} size={"xs"} className="rounded-full">
                Customers
              </Button>
            </div>
          </div>

          <div className="lg:flex w-full justify-between mb-4 grow">
            <div className="hidden lg:flex gap-4 mb-4 lg:mb-0">
              <Button
                variant={"default"}
                className="bg-neutral-300 text-foreground"
              >
                Service Providers
              </Button>
              <Button variant={"outline"}>Customers</Button>
            </div>
            <div className="w-full sm:w-72 ">
              <SearchBar initialValue={params.search || ""} />
            </div>
          </div>
        </div>

        <Suspense key={JSON.stringify(params)} fallback={<TableSkeleton />}>
          <ProvidersTable
            key={JSON.stringify(params)}
            data={data}
            meta={meta}
            currentParams={params}
          />
        </Suspense>
      </main>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-950">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
