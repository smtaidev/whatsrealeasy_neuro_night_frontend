"use client";

import Button from "@/components/Button";
import { exportToExcel } from "@/lib/exportToExcel";

export type TableHeader<T> = {
  key: keyof T;
  label: string;
};

type DownloadExcelButtonProps<
  T extends Record<string, string | number | null | undefined>
> = {
  data: T[];
  headers: readonly TableHeader<T>[];
  fileName?: string;
};

export function DownloadExcelButton<
  T extends Record<string, string | number | null | undefined>
>({ data, headers, fileName = "Export" }: DownloadExcelButtonProps<T>) {
  const handleDownload = async () => {
    const exportData: Record<string, string | number>[] = data.map((row) => {
      const mapped: Record<string, string | number> = {};
      headers.forEach(({ key, label }) => {
        const value = row[key];

        if (typeof value === "string") {
          mapped[label] = value.trim() === "" ? "N/A" : value;
        } else if (typeof value === "number") {
          mapped[label] = value === 0 ? "0" : value;
        } else {
          // null or undefined
          mapped[label] = "N/A";
        }
      });
      return mapped;
    });

    await exportToExcel(exportData, fileName);
  };

  return (
    <Button size="sm" onClick={handleDownload}>
      Download
    </Button>
  );
}
