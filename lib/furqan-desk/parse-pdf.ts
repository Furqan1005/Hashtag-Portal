/**
 * PDF → order item extraction. Pulls the text layer out of an uploaded PDF
 * (client-side, via pdfjs-dist) and hands it to the same heuristic parser
 * used for pasted emails — a PDF quotation/order is still just text once
 * extracted, so there's no separate extraction logic to maintain here.
 */

import type { TextItem } from "pdfjs-dist/types/src/display/api";

import { parseEmailToItems } from "./parse-email";
import type { ParsedLineItem } from "./request-builder";

let workerConfigured = false;

async function loadPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (!workerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    workerConfigured = true;
  }
  return pdfjsLib;
}

/**
 * pdf.js hands back a flat list of positioned text fragments with no line
 * breaks of its own — reconstructing them (including blank lines between
 * paragraphs, which is how the email parser tells one order line from the
 * next) means grouping fragments by their Y position and comparing the
 * gap between lines against the page's typical line height.
 */
function reconstructLines(items: TextItem[]): string {
  type Line = { y: number; text: string };
  const lines: Line[] = [];

  for (const item of items) {
    if (!item.str.trim()) continue;
    const y = Math.round(item.transform[5]);
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - y) < 2) {
      last.text += item.str;
    } else {
      lines.push({ y, text: item.str });
    }
  }

  if (lines.length < 2) return lines.map((l) => l.text).join("\n");

  const gaps = lines.slice(1).map((l, i) => Math.abs(lines[i].y - l.y));
  const sorted = [...gaps].sort((a, b) => a - b);
  const typicalGap = sorted[Math.floor(sorted.length / 2)] || 1;

  let out = lines[0].text;
  for (let i = 1; i < lines.length; i++) {
    const gap = Math.abs(lines[i - 1].y - lines[i].y);
    out += gap > typicalGap * 1.6 ? "\n\n" : "\n";
    out += lines[i].text;
  }
  return out;
}

export async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await loadPdfjs();
  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items.filter((item): item is TextItem => "str" in item);
    pages.push(reconstructLines(items));
  }
  return pages.join("\n\n");
}

export function parsePdfToItems(text: string, customer?: string): ParsedLineItem[] {
  return parseEmailToItems(text, customer);
}
