"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterParams } from "@/lib/db-repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Checkbox } from "./ui/checkbox";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

export function SidebarFilters({
  currentParams,
  onApply, // New optional callback prop
}: {
  currentParams: FilterParams;
  onApply?: () => void;
}) {
  const router = useRouter();

  // Keep separate local interactive element form hooks
  const [postcode, setPostcode] = useState(currentParams.postcode || "");
  const [status, setStatus] = useState(currentParams.status || "all");
  const [vendorType, setVendorType] = useState(
    currentParams.vendorType || "all",
  );
  const [serviceOffering, setServiceOffering] = useState(
    currentParams.serviceOffering || "all",
  );
  // const [startDate, setStartDate] = useState(currentParams.startDate || "");
  // const [endDate, setEndDate] = useState(currentParams.endDate || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    currentParams.startDate ? new Date(currentParams.startDate) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    currentParams.endDate ? new Date(currentParams.endDate) : undefined,
  );

  // Check state arrays to conditionally show the resetting clear trigger
  const hasActiveFilters = !!(
    currentParams.postcode ||
    currentParams.status ||
    currentParams.vendorType ||
    currentParams.serviceOffering ||
    currentParams.startDate ||
    currentParams.endDate
  );

  const handleApply = () => {
    const params = new URLSearchParams();

    // Retain global text searches across form submission cycles
    if (currentParams.search) params.set("search", currentParams.search);
    params.set("page", "1");

    if (postcode.trim()) params.set("postcode", postcode.trim());
    if (status !== "all") params.set("status", status);
    if (vendorType !== "all") params.set("vendorType", vendorType);
    if (serviceOffering !== "all")
      params.set("serviceOffering", serviceOffering);
    if (startDate)
      params.set("startDate", startDate.toLocaleDateString("en-US"));
    if (endDate) params.set("endDate", endDate.toLocaleDateString("en-US"));

    router.push(`?${params.toString()}`, { scroll: false });

    // Fire bonus requirement success notification context
    toast.add({
      title: "Filters applied successfully",
      description: "The service provider directory has been updated.",
    });

    if (onApply) onApply();
  };

  const handleClear = () => {
    setPostcode("");
    setStatus("all");
    setVendorType("all");
    setServiceOffering("all");
    setStartDate(undefined);
    setEndDate(undefined);

    const params = new URLSearchParams();
    if (currentParams.search) params.set("search", currentParams.search);
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });

    toast.add({
      title: "Filters cleared",
      description: "Showing all registered providers.",
    });

    if (onApply) onApply();
  };

  return (
    <div className="bg-neutral-100 p-4 w-[288px] h-full flex flex-col justify-between">
      {/* Logo Heading  */}
      <div className="flex items-baseline text-[#1a78f2]">
        <Image
          src={"/gler.svg"}
          alt={"gler logo"}
          width={50}
          height={50}
          className=""
        />
        <p className="leading-0 text-xl">Admin Panel</p>
      </div>
      {/* Admin Panel Title     */}
      <div className="flex items-center w-full h-9 bg-neutral-300 px-2 text-sm font-extrabold rounded-md">
        <p>User Management</p>
      </div>
      {/* Postcode String Search */}
      <div className="flex flex-col gap-2">
        <label className="text-sm pl-2 font-black">Postcode</label>
        <Input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="ZIP"
          className="h-9.5 py-4 px-2 w-fit bg-background border"
        />
      </div>

      {/* Registration Status Checkboxes */}
      <div className="flex flex-col gap-4">
        <label className="text-sm pl-2 font-black">Registration Status</label>
        <div className="space-y-4 pl-1">
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="status-onboarded"
              checked={status === "onboarded"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "onboarded" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="status-onboarded"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Onboarded
            </label>
          </div>
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="status-rejected"
              checked={status === "rejected"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "rejected" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="status-rejected"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Rejected
            </label>
          </div>
        </div>
      </div>

      {/* Date Registered Section */}
      <div className="flex flex-col gap-4">
        <label className="text-sm pl-2 font-black select-none">
          Date Registered
        </label>
        <div className="grid grid-cols-2 gap-4 px-1">
          {/* 1. Start Date Container */}
          <div className="flex flex-col gap-1 w-full">
            <Popover>
              <PopoverTrigger className="relative border-2 border-[#1a78f2] rounded-lg h-12 flex items-center justify-between px-3 shadow-xs hover:bg-neutral-50 cursor-pointer focus:ring-2 focus:ring-[#1a78f2]/20 isolate text-left w-full">
                <label className="absolute -top-2.5 left-2 z-10 px-1 bg-neutral-100 text-[10px] font-bold text-[#1a78f2] pointer-events-none select-none">
                  Date
                </label>
                <span
                  className={`text-sm font-medium ${startDate ? "text-neutral-800" : "text-neutral-400"}`}
                >
                  {startDate ? startDate.toLocaleDateString("en-US") : "Start"}
                </span>
                <CalendarDays className="size-4 text-neutral-900 pointer-events-none stroke-[1.5]" />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
            <span className="text-[10px] font-bold text-neutral-400 pl-2 tracking-wide select-none">
              MM/DD/YYYY
            </span>
          </div>

          {/* 2. End Date Container */}
          <div className="flex flex-col gap-1 w-full">
            <Popover>
              <PopoverTrigger className="relative border-2 border-[#1a78f2] rounded-lg h-12 flex items-center justify-between px-3 shadow-xs hover:bg-neutral-50 cursor-pointer focus:ring-2 focus:ring-[#1a78f2]/20 isolate text-left w-full">
                <label className="absolute -top-2.5 left-2 z-10 px-1 bg-neutral-100 text-[10px] font-bold text-[#1a78f2] pointer-events-none select-none">
                  Date
                </label>
                <span
                  className={`text-sm font-medium ${endDate ? "text-neutral-800" : "text-neutral-400"}`}
                >
                  {endDate ? endDate.toLocaleDateString("en-US") : "End"}
                </span>
                <CalendarDays className="size-4 text-neutral-900 pointer-events-none stroke-[1.5]" />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>
            <span className="text-[10px] font-bold text-neutral-400 pl-2 tracking-wide select-none">
              MM/DD/YYYY
            </span>
          </div>
        </div>
      </div>

      {/* Requirement 2: Vendor Type Checkboxes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm pl-2 font-black">Vendor Type</label>
        <div className="space-y-2 pl-1">
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="vendor-independent"
              checked={vendorType === "independent"}
              onCheckedChange={(checked) =>
                setVendorType(checked ? "independent" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="vendor-independent"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Independent
            </label>
          </div>
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="vendor-company"
              checked={vendorType === "company"}
              onCheckedChange={(checked) =>
                setVendorType(checked ? "company" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="vendor-company"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Company
            </label>
          </div>
        </div>
      </div>

      {/* Requirement 2: Service Offering Checkboxes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm pl-2 font-black">Service Offering</label>
        <div className="space-y-2 pl-1">
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="service-housekeeping"
              checked={serviceOffering === "housekeeping"}
              onCheckedChange={(checked) =>
                setServiceOffering(checked ? "housekeeping" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="service-housekeeping"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Housekeeping
            </label>
          </div>
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="service-window"
              checked={serviceOffering === "window cleaning"}
              onCheckedChange={(checked) =>
                setServiceOffering(checked ? "window cleaning" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="service-window"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Window Cleaning
            </label>
          </div>
          <div className="flex items-center space-x-4 text-[24px]">
            <Checkbox
              id="service-valet"
              checked={serviceOffering === "car valet"}
              onCheckedChange={(checked) =>
                setServiceOffering(checked ? "car valet" : "all")
              }
              className="size-5 border border-black/30 hover:ring-1"
            />
            <label
              htmlFor="service-valet"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              Car Valet
            </label>
          </div>
        </div>
      </div>

      {/* Buttons  */}
      <div className="flex flex-col justify-center items-center gap-2 border-t border-neutral-100 dark:border-neutral-900">
        <Button
          variant={"secondary"}
          onClick={() => {
            handleApply();
            if (onApply) onApply();
          }}
          className="w-full cursor-pointer"
        >
          Filter
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={() => {
              handleClear();
              if (onApply) onApply();
            }}
            variant="outline"
            className="w-full text-red-500 dark:text-red-400 hover:bg-red-500/50 dark:hover:bg-red-950/20 border-neutral-200 dark:border-neutral-800 cursor-pointer rounded-full transition-all"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
