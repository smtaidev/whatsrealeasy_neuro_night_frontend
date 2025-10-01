'use client'

import Button from "./Button";

export default function PrintButton() {
  return (
    <Button
    size="sm"
      onClick={() => window.print()}
      className="print:hidden px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Download
    </Button>
  );
}
