// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const filename = file.name.toLowerCase();
    
    let numericRowCount = 0;

    if (filename.endsWith('.csv')) {
      // Handle CSV files
      const text = new TextDecoder().decode(buffer);
      const result = Papa.parse(text, {
        dynamicTyping: true,
        skipEmptyLines: true,
        header: true
      });

      numericRowCount = countNumericRows(result.data);
    } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      // Handle Excel files
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { 
        raw: false,
        defval: null 
      });

      numericRowCount = countNumericRows(data);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Only CSV, XLS, and XLSX are supported.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      count: numericRowCount
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}

function countNumericRows(data: any[]): number {
  return data.filter(row => {
    // Check if at least one value in the row is a number
    return Object.values(row).some(value => {
      if (typeof value === 'number' && !isNaN(value)) {
        return true;
      }
      // Check if string can be parsed as number
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed !== '' && !isNaN(Number(trimmed));
      }
      return false;
    });
  }).length;
}