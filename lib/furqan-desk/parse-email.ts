/**
 * Heuristic email → order item extraction for the Estrella's Autopilot prototype.
 *
 * This is a deterministic, regex-based stand-in for the "AI reads the
 * request" step — good enough to demonstrate the concept end-to-end on a
 * real pasted email, but not a production NLP/LLM extraction pipeline.
 * The UI always frames its output as a suggestion for human review.
 */

import { getKnowledge } from "./mock-data";
import { translatePolish } from "./polish-glossary";
import type { ParsedLineItem } from "./request-builder";

const METAL_KEYWORDS = [
  "yellow gold",
  "white gold",
  "rose gold",
  "two tone gold",
  "gold plated",
  "gold 14k",
  "gold 9k",
  "gold 8k",
  "platinum",
  "silver",
  "steel",
  "brass",
  "gold",
];

/**
 * Customer-specific terminology (Customer Knowledge → Known Terminology) is
 * normalized to its canonical form before extraction, so e.g. Stokkeholm's
 * "Ref 66603" and another customer's "Reference: 66603" both parse the same
 * way. Ambiguous terms (flagged with a `note`) are left alone — those need a
 * human decision, not a silent substitution.
 */
function normalizeTerminology(body: string, customer?: string): string {
  if (!customer) return body;
  const knowledge = getKnowledge(customer);
  if (!knowledge) return body;

  let normalized = body;
  for (const { term, meaning, note } of knowledge.terminology) {
    if (note) continue; // ambiguous — don't guess
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    normalized = normalized.replace(new RegExp(`\\b${escaped}\\b`, "gi"), meaning);
  }
  return normalized;
}

/** Splits a body of text into paragraph-like blocks, one per likely order line. */
function splitIntoBlocks(body: string): string[] {
  const byBlankLine = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  // Some senders number/bullet each line instead of separating with blank
  // lines (e.g. "1. R7769 ..." / "2. R7771 ..." all on consecutive lines).
  // If blank-line splitting only produced one big block, fall back to
  // splitting on numbered/bulleted line starts.
  if (byBlankLine.length > 1) return byBlankLine;

  const bySequenceMarker = body
    .split(/\n(?=\s*(?:\d+[.)]|[-*•])\s)/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (bySequenceMarker.length > 1) return bySequenceMarker;

  // Last resort — no blank lines and no numbered/bulleted markers at all
  // (common after PDF text extraction, which doesn't always preserve
  // whitespace faithfully). Treat each "<qty> x <style>" line as the start
  // of a new item, since that's the one pattern every order line has.
  const byOrderLineStart = body
    .split(/\n(?=\s*\d+\s*x\s+[A-Za-z])/i)
    .map((b) => b.trim())
    .filter(Boolean);

  return byOrderLineStart.length > 1 ? byOrderLineStart : byBlankLine;
}

function extractQuantity(block: string): number {
  const m = block.match(/(\d+)\s*(?:x|pcs?|pieces?)\b/i) || block.match(/\bquantity\s*[:#]?\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : 1;
}

function extractDiamondWeight(block: string): string | null {
  const m =
    block.match(/(\d+(?:[.,]\d+)?)\s*(?:ct|cts|carat)\b/i) ||
    block.match(/diamond\s*weight\s*[:#]?\s*(\d+(?:[.,]\d+)?)/i);
  if (!m) return null;
  return `${m[1].replace(",", ".")} ct`;
}

function extractMetal(block: string): string {
  const lower = block.toLowerCase();
  const found = METAL_KEYWORDS.find((k) => lower.includes(k));
  if (!found) return "Not specified";
  return found.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/(\d)k\b/gi, "$1K");
}

function extractSize(block: string): string {
  const m = block.match(/size\s*[:#]?\s*(\d+(?:\.\d+)?)/i) || block.match(/\bsz\.?\s*(\d+(?:\.\d+)?)/i);
  return m ? m[1] : "—";
}

function extractReference(block: string): string {
  const m =
    block.match(/\bcustomer\s*reference\s*[:#]?\s*([A-Za-z0-9-]+)/i) ||
    block.match(/\bref(?:erence)?\.?\s*[:#]?\s*([A-Za-z0-9-]+)/i) ||
    block.match(/\bpo\.?\s*(?:no\.?|number)?\s*[:#]?\s*([A-Za-z0-9-]+)/i);
  return m ? m[1] : "—";
}

function extractStyleNo(block: string, exclude: string[]): string | null {
  let stripped = block;
  for (const value of exclude) {
    if (value && value !== "—") {
      stripped = stripped.replace(new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " ");
    }
  }
  // Also strip the diamond-weight number itself (e.g. "0,50" before "ct" was replaced already),
  // and any leading sequence marker ("1.", "2)", "-", "•").
  stripped = stripped
    .replace(/\d+(?:[.,]\d+)?\s*(?:ct|cts|carat)\b/gi, " ")
    .replace(/^\s*(?:\d+[.)]|[-*•])\s*/, " ");

  const candidates = stripped.match(/\b[A-Za-z]{1,5}\d{3,7}[A-Za-z0-9-]*\b/g) || [];
  const first = candidates[0];
  return first ? first.toUpperCase() : null;
}

export function parseEmailToItems(body: string, customer?: string): ParsedLineItem[] {
  const { text: translated } = translatePolish(body);
  const normalized = normalizeTerminology(translated, customer);
  const blocks = splitIntoBlocks(normalized);
  const items: ParsedLineItem[] = [];

  for (const block of blocks) {
    const diamondWeight = extractDiamondWeight(block);
    const size = extractSize(block);
    const customerReference = extractReference(block);
    const styleNo = extractStyleNo(block, [size, customerReference]);
    if (!styleNo) continue;

    items.push({
      raw: block,
      customerStyleNo: styleNo,
      quantity: extractQuantity(block),
      diamondWeight,
      metal: extractMetal(block),
      size,
      customerReference,
    });
  }

  return items;
}
