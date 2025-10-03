"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

const STATUSES = [
  "initiated",
  "ringing",
  "in-progress",
  "completed",
  "failed",
  "busy",
  "no-answer",
  "canceled",
];

export function TableFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = React.useTransition();
  
  // Get initial value from URL
  const currentStatus = searchParams.get("call_status") || "all";

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (val === "all") {
      params.delete("call_status");
    } else {
      params.set("call_status", val);
    }
    
    // Reset to page 1 when filtering
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}