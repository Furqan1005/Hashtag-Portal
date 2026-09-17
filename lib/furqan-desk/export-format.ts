/**
 * Export column layout for the Excel preview / TSV download.
 *
 * This is the one place that defines what the final output looks like.
 * It's the default demo layout — when the team supplies their real export
 * format, only this file (and, if the image column needs to move, the
 * table markup in export-panel.tsx) needs to change.
 */

import { currency, type CurrencyCode } from "./mock-data";

export interface ExportRow {
  styleNo: string;
  productReference: string;
  material: string;
  diamondWeight: string;
  quantity: number;
  value: number | null;
  totalValue: number | null;
}

export interface ExportColumn {
  key: keyof ExportRow;
  label: string;
  align?: "right";
  format?: (value: ExportRow[keyof ExportRow], currencyCode: CurrencyCode) => string;
}

const currencyFormat = (value: ExportRow[keyof ExportRow], currencyCode: CurrencyCode) =>
  typeof value === "number" ? currency(value, currencyCode) : "—";

export const DEFAULT_EXPORT_COLUMNS: ExportColumn[] = [
  { key: "styleNo", label: "Style No." },
  { key: "productReference", label: "Product Reference" },
  { key: "material", label: "Material" },
  { key: "diamondWeight", label: "Diamond Wt" },
  { key: "quantity", label: "Quantity", align: "right" },
  { key: "value", label: "Value", align: "right", format: currencyFormat },
  { key: "totalValue", label: "Total Value", align: "right", format: currencyFormat },
];

export function formatExportCell(
  column: ExportColumn,
  row: ExportRow,
  currencyCode: CurrencyCode
): string {
  const raw = row[column.key];
  if (column.format) return column.format(raw, currencyCode);
  return raw != null ? String(raw) : "—";
}
