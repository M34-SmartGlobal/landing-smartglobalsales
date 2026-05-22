export type CsvRow = Record<string, string | number | boolean | null | undefined>;

function escapeCsvCell(value: CsvRow[string]) {
  const normalized = value == null ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function toCsv(rows: CsvRow[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(","));
  return [headers.map(escapeCsvCell).join(","), ...body].join("\n");
}

export function downloadCsv(filename: string, rows: CsvRow[]) {
  const csv = toCsv(rows);
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
