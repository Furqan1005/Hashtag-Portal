/**
 * Export column layout for the Excel preview / TSV download.
 *
 * This mirrors a real order confirmation the team sends back to a customer
 * (the "Order Confirmation" workbook the user shared: No. / Item No. /
 * Artikelnummer / Colour / Product Name / WG(g) / Diamond Details /
 * Unit Price / Qty / Amount / Remark / Remark, plus a totals + 30% advance
 * footer and a gold-price note at the top).
 *
 * The price columns' currency follows the request's own pricing profile
 * rather than being hardcoded, so the layout stays correct for every
 * customer even though the source example happened to be priced in USD.
 */

import { currency, jemrData, type CurrencyCode, type OrderItem } from "./mock-data";

export interface ExportRow {
  no: number;
  itemNo: string;
  artikelnummer: string;
  colour: string;
  productName: string;
  metalWeight: string;
  diamondDetails: string;
  unitPrice: number | null;
  quantity: number;
  amount: number | null;
  remark: string;
  note: string;
}

const METAL_CODES: Record<string, string> = {
  "yellow gold": "YG",
  "white gold": "WG",
  "rose gold": "RG",
  "two tone gold": "TT",
  platinum: "PT",
  silver: "SLV",
};

function metalCode(metal: string): string {
  return METAL_CODES[metal.toLowerCase()] ?? metal;
}

export function buildExportRow(item: OrderItem, index: number): ExportRow {
  const record = item.internalDesign ? jemrData[item.internalDesign] : undefined;
  const productName = record?.other ? record.other.split("·")[0].trim() : "—";
  const isLabGrown = record?.other?.toLowerCase().includes("lab") ?? false;
  const diamondDetails = isLabGrown ? "Lab Diamond" : item.diamondWeight ? "Diamond" : "—";
  const metalWeight = record?.metalWeight ? record.metalWeight.replace(/\s*g$/i, "") : "—";
  const remark = productName !== "—" ? `${productName}/${metalCode(item.metal)}` : metalCode(item.metal);

  return {
    no: index + 1,
    // "Item No." is Estrella's own internal number; "Artikelnummer" is the
    // customer's own design number — see HEADER_ALIASES in parse-excel.ts.
    itemNo: item.internalDesign ?? "Pending manual match",
    artikelnummer: item.customerStyleNo,
    colour: "",
    productName,
    metalWeight,
    diamondDetails,
    unitPrice: item.value,
    quantity: item.quantity,
    amount: item.value != null ? item.value * item.quantity : null,
    remark,
    note: "",
  };
}

export interface ExportColumn {
  key: keyof ExportRow;
  label: string;
  align?: "right";
  isCurrency?: boolean;
}

export const DEFAULT_EXPORT_COLUMNS: ExportColumn[] = [
  { key: "no", label: "No.", align: "right" },
  { key: "itemNo", label: "Item No." },
  { key: "artikelnummer", label: "Artikelnummer" },
  { key: "colour", label: "Colour" },
  { key: "productName", label: "Product Name" },
  { key: "metalWeight", label: "WG(g)", align: "right" },
  { key: "diamondDetails", label: "Diamond Details" },
  { key: "unitPrice", label: "Unit Price/pcs", align: "right", isCurrency: true },
  { key: "quantity", label: "Qty", align: "right" },
  { key: "amount", label: "Amount", align: "right", isCurrency: true },
  { key: "remark", label: "Remark" },
  { key: "note", label: "Remark" },
];

export function formatExportCell(
  column: ExportColumn,
  row: ExportRow,
  currencyCode: CurrencyCode
): string {
  const raw = row[column.key];
  if (raw == null || raw === "") return column.key === "colour" || column.key === "note" ? "" : "—";
  if (column.isCurrency && typeof raw === "number") return currency(raw, currencyCode);
  return String(raw);
}

export interface ExportTotals {
  quantity: number;
  amount: number;
  advance: number;
}

export function computeExportTotals(rows: ExportRow[]): ExportTotals {
  const quantity = rows.reduce((sum, r) => sum + r.quantity, 0);
  const amount = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  return { quantity, amount, advance: amount * 0.3 };
}
