"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ServiceProvider } from "@/data/mock-providers";
import { FilterParams } from "@/lib/db-repository";
import { toast } from "@/components/ui/toast"; // Direct correct shadcn export path

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Edit2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDaysIcon,
  FileText,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

interface ProvidersTableProps {
  data: ServiceProvider[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  currentParams: FilterParams;
}

export function ProvidersTable({
  data,
  meta,
  currentParams,
}: ProvidersTableProps) {
  const router = useRouter();

  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, "Onboarded" | "Rejected">
  >({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeModalProvider, setActiveModalProvider] =
    useState<ServiceProvider | null>(null);

  const displayData = data.map((provider) => {
    const overriddenStatus = statusOverrides[provider.id];
    if (overriddenStatus) {
      return { ...provider, status: overriddenStatus };
    }
    return provider;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const updateUrlParam = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSort = (columnKey: string) => {
    let nextOrder: "asc" | "desc" | null = "asc";
    if (currentParams.sortBy === columnKey) {
      if (currentParams.sortOrder === "asc") nextOrder = "desc";
      else nextOrder = null;
    }
    updateUrlParam({
      sortBy: nextOrder ? columnKey : null,
      sortOrder: nextOrder,
    });
  };

  const renderSortIcon = (columnKey: string) => {
    if (currentParams.sortBy !== columnKey)
      return <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />;
    return currentParams.sortOrder === "asc" ? (
      <ChevronUp className="ml-2 h-3.5 w-3.5 text-black dark:text-white" />
    ) : (
      <ChevronDown className="ml-2 h-3.5 w-3.5 text-black dark:text-white" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Selection Utility Floating Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-10 left-1/2 z-50 bg-chart-4 text-white px-5 py-3 rounded-xl flex items-center gap-6 shadow-xl text-sm"
          >
            <span>
              Selected{" "}
              <strong className="text-destructive text-lg">
                {selectedIds.length}
              </strong>{" "}
              service providers
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/80 hover:bg-neutral-800 h-7 px-2 cursor-pointer font-medium"
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-x-auto">
        <Table className="min-w-225">
          <TableHeader>
            <TableRow className="bg-neutral-200">
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(val) => handleSelectAll(!!val)}
                  className="size-5 border border-black/30 hover:ring-1"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center font-black">
                  Email {renderSortIcon("email")}
                </div>
              </TableHead>
              <TableHead className="font-black">Phone Number</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("postcode")}
              >
                <div className="flex items-center font-black">
                  Postcode {renderSortIcon("postcode")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("vendorType")}
              >
                <div className="flex items-center font-black">
                  Vendor Type {renderSortIcon("vendorType")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("serviceOffering")}
              >
                <div className="flex items-center font-black">
                  Service Offering {renderSortIcon("serviceOffering")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("signupDate")}
              >
                <div className="flex items-center font-black">
                  Signup Date {renderSortIcon("signupDate")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center font-black justify-center lg:justify-start lg:pl-2">
                  Status {renderSortIcon("status")}
                </div>
              </TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout" initial={false}>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-20 text-center text-neutral-500 px-6"
                  >
                    No service providers match the chosen query parameters.
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((provider) => (
                  <motion.tr
                    key={provider.id}
                    layoutId={`row-${provider.id}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="group h-16 border-b last:border-0 even:bg-[#EAEEF3]"
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.includes(provider.id)}
                        onCheckedChange={(val) =>
                          handleSelectRow(provider.id, !!val)
                        }
                        className="size-5 border border-black/40 hover:ring-1"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-neutral-900 dark:text-neutral-100 max-w-50 truncate">
                      {provider.email}
                    </TableCell>
                    <TableCell className="text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {provider.phone}
                    </TableCell>
                    <TableCell className="font-mono text-xs uppercase tracking-wider">
                      {provider.postcode}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          provider.vendorType === "Company"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                            : "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                        }`}
                      >
                        {provider.vendorType}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {provider.serviceOffering}
                    </TableCell>
                    <TableCell className="text-neutral-500 text-sm whitespace-nowrap">
                      {provider.signupDate}
                    </TableCell>
                    <TableCell>
                      <span
                        key={provider.status}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-xs animate-[pulse_.7s_ease-in-out_3] ${
                          provider.status === "Onboarded"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                            : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-100 dark:border-red-900/50"
                        }`}
                      >
                        <span className="flex h-2 w-2">
                          <span
                            className={`inline-flex rounded-full h-2 w-2 ${
                              provider.status === "Onboarded"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />
                        </span>
                        {provider.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all cursor-pointer"
                        onClick={() => setActiveModalProvider(provider)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-sm text-neutral-500">
          <div>
            Showing rows{" "}
            <strong>{(meta.currentPage - 1) * meta.limit + 1}</strong> to{" "}
            <strong>
              {Math.min(meta.currentPage * meta.limit, meta.totalItems)}
            </strong>{" "}
            of <strong>{meta.totalItems}</strong> entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-neutral-200 dark:border-neutral-800 disabled:opacity-40 cursor-pointer"
              disabled={meta.currentPage === 1}
              onClick={() =>
                updateUrlParam({ page: (meta.currentPage - 1).toString() })
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: meta.totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={
                    meta.currentPage === pageNumber ? "default" : "outline"
                  }
                  className={`h-8 w-8 text-xs font-semibold cursor-pointer ${
                    meta.currentPage === pageNumber
                      ? "shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800"
                  }`}
                  onClick={() =>
                    updateUrlParam({ page: pageNumber.toString() })
                  }
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-neutral-200 dark:border-neutral-800 disabled:opacity-40 cursor-pointer"
              disabled={meta.currentPage === meta.totalPages}
              onClick={() =>
                updateUrlParam({ page: (meta.currentPage + 1).toString() })
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={!!activeModalProvider}
        onOpenChange={(open) => !open && setActiveModalProvider(null)}
      >
        <DialogContent className="max-w-xl! p-6 transition-all duration-300 ease-out data-[state=closed]:duration-200 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <DialogHeader className="flex flex-row items-center gap-2">
            <User className="size-6 text-muted-foreground" />
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {activeModalProvider && (
            <div className="">
              {/* Header  */}
              <div className="grid grid-cols-3 gap-2 border-b py-4">
                <div className="flex flex-col gap-2 col-span-2">
                  <span className="text-xl font-black">
                    {activeModalProvider.companyName}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="stroke-1" />
                    <span className="">{activeModalProvider.companyEmail}</span>
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <Badge
                    variant={"secondary"}
                    className="text-sm font-light py-3 px-4"
                  >
                    Customer
                  </Badge>
                  <Badge
                    variant={"secondary"}
                    className="text-sm font-light py-3 px-4"
                  >
                    invited
                  </Badge>
                </div>
              </div>

              {/* Contact Info  */}
              <div className="grid grid-cols-5 gap-2 border-b py-4 space-y-4">
                <p className="text-xl font-black col-span-5">
                  Contact Information
                </p>
                <div className="flex items-center gap-1 grow col-span-3 h-7.5">
                  <Mail className="stroke-1 size-5" />
                  <span className="text-lg text-muted-foreground">
                    {activeModalProvider.email}
                  </span>
                </div>
                <div className="flex items-center gap-1 grow col-span-2 h-7.5">
                  <Phone className="stroke-1 size-5" />
                  <span className="text-lg text-muted-foreground">
                    {activeModalProvider.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1 grow col-span-3 h-7.5">
                  <MapPin className="stroke-1 size-5" />
                  <span className="text-lg text-muted-foreground">
                    {activeModalProvider.country}
                  </span>
                </div>
                <div className="flex items-center gap-1 grow col-span-2 h-7.5">
                  <CalendarDaysIcon className="stroke-1 size-5" />
                  <span className="text-lg text-muted-foreground">
                    Signed up {activeModalProvider.signupDate}
                  </span>
                </div>
              </div>

              {/* Customer Info  */}
              <div className="grid grid-cols-5 gap-2 border-b py-4">
                <p className="text-xl font-black col-span-5">
                  Customer Details
                </p>
                <div className="flex items-center gap-1 grow col-span-3">
                  <User className="stroke-1 size-5" />
                  <span className="text-lg text-muted-foreground">
                    {activeModalProvider.vendorType}
                  </span>
                </div>
                <div className="flex flex-col gap-1 grow col-span-3">
                  <p className="text-xl font-black col-span-5">User Details</p>
                  <span className="text-lg text-muted-foreground">
                    {activeModalProvider.serviceOffering}
                  </span>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <FileText className="stroke-1 size-5 text-muted-foreground" />
                    <p className="text-xl font-black">Internal Notes</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-neutral-400 select-none">
                    <Edit2 className="size-3.5" />
                    <span>Edit</span>
                  </div>
                </div>
                <Textarea
                  placeholder="No Note Added Yet"
                  className="min-h-25 resize-y bg-neutral-100"
                />
              </div>
            </div>
          )}
          <DialogFooter className="bg-transparent border-none justify-center!">
            <div className="flex items-center justify-center gap-4 w-full">
              <Button
                variant="secondary"
                className="w-40 text-lg cursor-pointer"
                onClick={() => {
                  if (activeModalProvider) {
                    // Add the 'Onboarded' status override for this specific ID
                    setStatusOverrides((prev) => ({
                      ...prev,
                      [activeModalProvider.id]: "Onboarded",
                    }));
                    setActiveModalProvider(null);
                    toast.add({
                      title: "Vendor Onboarded",
                      description: `${activeModalProvider.companyName || "Vendor"} status has been updated to Active.`,
                    });
                  }
                }}
              >
                Onboard
              </Button>
              <Button
                variant="destructive"
                className="w-40 text-lg cursor-pointer"
                onClick={() => {
                  if (activeModalProvider) {
                    // Add the 'Rejected' status override for this specific ID
                    setStatusOverrides((prev) => ({
                      ...prev,
                      [activeModalProvider.id]: "Rejected",
                    }));
                    setActiveModalProvider(null);
                    toast.add({
                      title: "Vendor Application Rejected",
                      description: `${activeModalProvider.companyName || "Vendor"} status has been set to Rejected.`,
                    });
                  }
                }}
              >
                Reject
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
