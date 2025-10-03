import * as XLSX from "xlsx";

export async function exportToExcel<
  T extends Record<string, string | number | null | undefined>
>(data: T[], fileName: string): Promise<void> {
  if (!data.length) {
    console.warn("No data to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Optional: auto column widths
  const columns = Object.keys(data[0]);
  worksheet["!cols"] = columns.map((col) => {
    const maxLength = Math.max(
      ...data.map((row) => (row[col] ? String(row[col]).length : 0)),
      col.length
    );
    return { wch: Math.min(Math.max(maxLength, 10), 50) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
