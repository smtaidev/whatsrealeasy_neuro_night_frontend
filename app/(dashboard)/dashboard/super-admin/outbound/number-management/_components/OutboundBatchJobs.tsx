"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  // DialogClose,
} from "@/components/ui/dialog";
import Button from "@/components/Button";

// -------------------- Types --------------------
type BatchJob = {
  job_id: string;
  status: "failed" | "pending" | "completed";
  calling_to: string;
  total_numbers: number;
  submitted_batches: number;
  start_time: string;
  end_time: string | null;
  estimated_cost: number;
  estimated_ending_time: string;
  completed: boolean;
  call_duration?: number;
  total_calls_completed?: number;
  cost_of_completed_calls?: number;
};

type TableHeader = {
  key: keyof BatchJob | "total_calls_completed" | "cost_of_completed_calls";
  label: string;
};

// -------------------- Fetch function --------------------
async function fetchBatchJobs(
  page: number,
  limit: number
): Promise<{
  page: number;
  limit: number;
  total_jobs: number;
  total_pages: number;
  jobs: BatchJob[];
}> {
  const res = await fetch(
    `https://docs-outbound.advanceaimarketing.cloud/outbound/all-batch-jobs/?page=${page}&limit=${limit}`
  );
  return res.json();
}

// -------------------- Pagination --------------------
const Pagination: React.FC<{
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex gap-2 justify-center mt-4">
      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 border rounded ${
            p === currentPage ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

// -------------------- Main Component --------------------
export default function BatchJobsTable() {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch jobs
  useEffect(() => {
    async function loadJobs() {
      const response = await fetchBatchJobs(page, limit);
      console.log(response);
      const jobsWithCost = response.jobs.map((job) => {
        const completedCalls = job.total_numbers;
        const duration = job.call_duration || 1;
        const costPerCall = 0.013 + 0.14;
        return {
          ...job,
          total_calls_completed: completedCalls,
          cost_of_completed_calls: completedCalls * costPerCall * duration,
        };
      });
      setJobs(jobsWithCost);
      setTotalPages(response.total_pages);
    }
    loadJobs();
  }, [page, limit]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sorted jobs
  const sortedJobs = [...jobs]
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField as keyof typeof a];
      const valB = b[sortField as keyof typeof b];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    })
    .filter((job) => job.status === "completed");

  const tableHeader: TableHeader[] = [
    { key: "calling_to", label: "Calling To" },
    { key: "start_time", label: "Schedule Start Time" },
    { key: "end_time", label: "End Time" },
    { key: "total_numbers", label: "Total Numbers" },
    { key: "total_calls_completed", label: "Total Calls Completed" },
    { key: "estimated_cost", label: "Estimated Cost" },
    {
      key: "cost_of_completed_calls",
      label: "Cost of Estimated Complete Calls",
    },
  ];

  const totalCost = sortedJobs.reduce(
    (sum, job) => sum + (job.cost_of_completed_calls || 0),
    0
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">View Batch Jobs</Button>
      </DialogTrigger>
      <DialogContent className="w-full! max-w-6xl! overflow-auto bg-gray-900 z-[9999]">
        <DialogHeader>
          <DialogTitle>Batch Jobs Table</DialogTitle>
          {/* <DialogClose className="absolute top-2 right-2">✖</DialogClose> */}
        </DialogHeader>

        <table className="w-full border-collapse border mt-4 bg-gray-900">
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th
                  key={header.key}
                  className="border px-2 py-1 cursor-pointer select-none"
                  onClick={() => handleSort(header.key)}
                >
                  {header.label}{" "}
                  {sortField === header.key
                    ? sortDirection === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedJobs.map((job) => (
              <tr key={job.job_id} className="hover:bg-gray-950">
                {tableHeader.map(({ key }) => {
                  let value = job[key as keyof typeof job] ?? "N/A";

                  if (
                    key === "estimated_cost" ||
                    key === "cost_of_completed_calls"
                  ) {
                    value = `$${Number(value).toFixed(2)}`;
                  }

                  if (key === "start_time" || key === "end_time") {
                    value = value
                      ? new Date(value as string).toLocaleString()
                      : "N/A";
                  }

                  if (key === "calling_to") {
                    value = value.toString().split(".")[0];
                  }

                  return (
                    <td key={key} className="border px-2 py-1 text-center">
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-950">
              <td
                colSpan={tableHeader.length - 1}
                className="text-right px-2 py-1 font-bold"
              >
                Total Cost:
              </td>
              <td className="text-center px-2 py-1 font-bold">
                ${totalCost.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
        />
      </DialogContent>
    </Dialog>
  );
}
