/**
 * Excel → order item extraction. Reads the first sheet of an uploaded
 * workbook, finds the header row by matching known column-name variants
 * (the same "customer terminology" idea as email parsing, applied to
 * spreadsheet headers), and maps rows into the shared ParsedLineItem shape.
 *
 * Deterministic/heuristic, like the email parser — not a real AI extraction
 * pipeline, and always surfaced to the user as a suggestion to review.
 */

import * as XLSX from "xlsx";

import type { ParsedLineItem } from "./request-builder";

type ColumnKey =
  | "customerStyleNo"
  | "internalDesign"
  | "metal"
  | "diamondWeight"
  | "quantity"
  | "value"
  | "customerReference"
  | "size";

const HEADER_ALIASES: Record<ColumnKey, string[]> = {
  // "Artikelnummer" is the customer's own design number (confirmed against
  // a real Diara file); "Item No." is Estrella's internal production number.
  customerStyleNo: ["artikelnummer", "style no", "style no.", "customer style", "sku", "customer ref no"],
  internalDesign: ["item no", "item no.", "internal design", "product reference", "design no", "design no.", "article number", "articel number"],
  metal: ["material", "metal"],
  diamondWeight: ["gewicht/carat", "carat", "diamond wt", "diamond weight", "dia wt"],
  quantity: ["qty", "quantity", "pcs"],
  value: ["price eur", "price chf", "price", "value", "amount"],
  customerReference: ["customer reference", "customer ref", "reference", "po number", "po no", "ref"],
  size: ["size"],
};

function normalizeHeader(cell: unknown): string {
  return String(cell ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Scans the first few rows for the one that best matches known column
 * headers. For each field, aliases are tried in the order listed (most
 * specific first) rather than by column position — so e.g. "Price EUR"
 * wins the `value` column over an earlier, emptier "Amount" column, and a
 * generic alias can't steal a column that a more specific one also fits.
 * Exact-header matches across every field are resolved before any
 * substring match is allowed, so a short/generic alias (e.g. "ref") can't
 * steal a column from an exact match elsewhere in the row just because it
 * happens to be scanned first (e.g. "Product Name" containing "duct").
 */
function findHeaderRow(rows: unknown[][]): { headerIndex: number; columns: Partial<Record<ColumnKey, number>> } {
  let best = { headerIndex: 0, columns: {} as Partial<Record<ColumnKey, number>>, score: 0 };

  for (let r = 0; r < Math.min(rows.length, 5); r++) {
    const row = rows[r];
    if (!row) continue;

    const headers = row.map(normalizeHeader);
    const columns: Partial<Record<ColumnKey, number>> = {};
    const assignedCols = new Set<number>();

    const tryAssign = (matches: (header: string, alias: string) => boolean) => {
      for (const [key, aliases] of Object.entries(HEADER_ALIASES) as [ColumnKey, string[]][]) {
        if (key in columns) continue;
        for (const alias of aliases) {
          const colIndex = headers.findIndex((header, i) => header && !assignedCols.has(i) && matches(header, alias));
          if (colIndex !== -1) {
            columns[key] = colIndex;
            assignedCols.add(colIndex);
            break;
          }
        }
      }
    };

    tryAssign((header, alias) => header === alias);
    tryAssign((header, alias) => header.includes(alias));

    const score = Object.keys(columns).length;
    if (score > best.score) {
      best = { headerIndex: r, columns, score };
    }
  }

  return best;
}

export interface ExcelParseResult {
  items: ParsedLineItem[];
  rowCount: number;
  matchedColumns: ColumnKey[];
  sheetName: string;
}

export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });

  const { headerIndex, columns } = findHeaderRow(rows);
  const dataRows = rows.slice(headerIndex + 1);

  const items: ParsedLineItem[] = [];
  for (const row of dataRows) {
    const styleCol = columns.customerStyleNo;
    const styleNo = styleCol != null ? String(row[styleCol] ?? "").trim() : "";
    if (!styleNo) continue;

    const get = (key: ColumnKey): string => {
      const col = columns[key];
      return col != null ? String(row[col] ?? "").trim() : "";
    };

    const qtyRaw = get("quantity");
    const quantity = qtyRaw ? parseInt(qtyRaw, 10) || 1 : 1;

    const caratRaw = get("diamondWeight");
    const caratMatch = caratRaw.match(/(\d+(?:[.,]\d+)?)/);
    const diamondWeight = caratMatch ? `${caratMatch[1].replace(",", ".")} ct` : null;

    const valueRaw = get("value");
    const valueMatch = valueRaw.match(/([\d][\d,]*(?:\.\d+)?)/);
    const valueHint = valueMatch ? parseFloat(valueMatch[1].replace(/,/g, "")) : null;

    items.push({
      raw: row.map((c) => String(c ?? "")).join(" | "),
      customerStyleNo: styleNo.toUpperCase(),
      quantity,
      diamondWeight,
      metal: get("metal") || "Not specified",
      size: get("size") || "—",
      customerReference: get("customerReference") || "—",
      internalDesignHint: get("internalDesign") || null,
      valueHint,
    });
  }

  return {
    items,
    rowCount: dataRows.length,
    matchedColumns: Object.keys(columns) as ColumnKey[],
    sheetName,
  };
}
