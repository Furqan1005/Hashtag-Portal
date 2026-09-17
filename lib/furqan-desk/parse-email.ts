/**
 * Heuristic email → order item extraction for the Estrella's Autopilot prototype.
 *
 * This is a deterministic, regex-based stand-in for the "AI reads the
 * request" step — good enough to demonstrate the concept end-to-end on a
 * real pasted email, but not a production NLP/LLM extraction pipeline.
 * The UI always frames its output as a suggestion for human review.
 */

import {
  catalogueImages,
  jemrData,
  getKnowledge,
  type Confidence,
  type CustomerRequest,
  type FieldAudit,
  type OrderItem,
} from "./mock-data";

const METAL_KEYWORDS = [
  "yellow gold",
  "white gold",
  "rose gold",
  "two tone gold",
  "platinum",
  "silver",
];

// Style numbers a real customer might reuse from the demo catalogue, so the
// live intake flow can show the same high/medium-confidence matches as the
// seeded requests when the pasted email overlaps with them.
const GLOBAL_STYLE_TO_DESIGN: Record<string, string> = {
  R7769: "JE02878262",
  R7771: "JE02884713",
  LBC078267: "JE02878262",
  LBC078311: "JE02884502",
  "CC-772": "JE02891920",
  "CC-991": "JE02890114",
};

const IMAGE_VARIANTS = ["amber", "cocoa", "cream", "noir"] as const;

export interface ParsedLineItem {
  raw: string;
  customerStyleNo: string;
  quantity: number;
  diamondWeight: string | null;
  metal: string;
  size: string;
  customerReference: string;
}

function imageVariantFor(styleNo: string) {
  let hash = 0;
  for (const ch of styleNo) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return IMAGE_VARIANTS[hash % IMAGE_VARIANTS.length];
}

/** Splits an email body into paragraph-like blocks, one per likely order line. */
function splitIntoBlocks(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

function extractQuantity(block: string): number {
  const m = block.match(/(\d+)\s*x\b/i);
  return m ? parseInt(m[1], 10) : 1;
}

function extractDiamondWeight(block: string): string | null {
  const m = block.match(/(\d+(?:[.,]\d+)?)\s*(?:ct|cts|carat)\b/i);
  if (!m) return null;
  return `${m[1].replace(",", ".")} ct`;
}

function extractMetal(block: string): string {
  const lower = block.toLowerCase();
  const found = METAL_KEYWORDS.find((k) => lower.includes(k));
  if (!found) return "Not specified";
  return found.replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractSize(block: string): string {
  const m = block.match(/size\s*[:#]?\s*(\d+(?:\.\d+)?)/i);
  return m ? m[1] : "—";
}

function extractReference(block: string): string {
  const m = block.match(/\bref(?:erence)?\.?\s*[:#]?\s*([A-Za-z0-9-]+)/i);
  return m ? m[1] : "—";
}

function extractStyleNo(block: string, exclude: string[]): string | null {
  let stripped = block;
  for (const value of exclude) {
    if (value && value !== "—") {
      stripped = stripped.replace(new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " ");
    }
  }
  // Also strip the diamond-weight number itself (e.g. "0,50" before "ct" was replaced already).
  stripped = stripped.replace(/\d+(?:[.,]\d+)?\s*(?:ct|cts|carat)\b/gi, " ");

  const candidates = stripped.match(/\b[A-Za-z]{1,5}\d{3,7}[A-Za-z0-9-]*\b/g) || [];
  const first = candidates[0];
  return first ? first.toUpperCase() : null;
}

export function parseEmailToItems(body: string): ParsedLineItem[] {
  const blocks = splitIntoBlocks(body);
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

export interface DesignMatch {
  internalDesign: string | null;
  confidence: Confidence;
  reasons: string[];
}

export function matchDesign(customer: string, styleNo: string): DesignMatch {
  const knowledge = getKnowledge(customer);
  const confirmed = knowledge?.confirmedMappings.find(
    (m) => m.customerStyle.toUpperCase() === styleNo.toUpperCase()
  );
  if (confirmed) {
    return {
      internalDesign: confirmed.internalDesign,
      confidence: "high",
      reasons: [
        `Confirmed mapping in Customer Knowledge (saved ${confirmed.confirmedOn})`,
        "Customer history match",
      ],
    };
  }

  const global = GLOBAL_STYLE_TO_DESIGN[styleNo.toUpperCase()];
  if (global) {
    return {
      internalDesign: global,
      confidence: "medium",
      reasons: ["Similar/reference mapping found in catalogue", "Product attributes match"],
    };
  }

  return {
    internalDesign: null,
    confidence: "low",
    reasons: [
      "No confirmed mapping in Customer Knowledge for this style",
      "No confident catalogue match — manual lookup required",
    ],
  };
}

function estimateValue(internalDesign: string | null): number | null {
  if (!internalDesign) return null;
  const record = jemrData[internalDesign];
  if (!record) return null;
  // Grabs the first number in the string regardless of currency symbol
  // ("₹48,500", "€599", "Fr. 3,720"), so this works for any customer's
  // pricing currency rather than assuming rupees.
  const digits = record.currentPricing.match(/([\d][\d,]*)/);
  return digits ? parseInt(digits[1].replace(/,/g, ""), 10) : null;
}

export function buildLiveRequest({
  customer,
  subject,
  from,
  body,
}: {
  customer: string;
  subject: string;
  from: string;
  body: string;
}): CustomerRequest {
  const parsed = parseEmailToItems(body);

  const items: OrderItem[] = parsed.map((p, i) => {
    const match = matchDesign(customer, p.customerStyleNo);
    const value = estimateValue(match.internalDesign);
    const audit: Record<string, FieldAudit> = {
      customerStyleNo: "ai",
      internalDesign: "ai",
      diamondWeight: "ai",
      quantity: "ai",
      metal: "ai",
      size: "ai",
      customerReference: "ai",
      value: "ai",
    };

    return {
      id: `live-item-${i}`,
      customerStyleNo: p.customerStyleNo,
      internalDesign: match.internalDesign,
      imageVariant: imageVariantFor(p.customerStyleNo),
      imageSrc: match.internalDesign ? catalogueImages[match.internalDesign] : undefined,
      diamondWeight: p.diamondWeight,
      quantity: p.quantity,
      metal: p.metal,
      size: p.size,
      customerReference: p.customerReference,
      value,
      confidence: match.confidence,
      status: match.confidence === "low" ? "Review Required" : "Ready for Review",
      matchReasons: match.reasons,
      fieldAudit: audit,
    };
  });

  const hasLow = items.some((i) => i.confidence === "low");
  const hasMedium = items.some((i) => i.confidence === "medium");
  const aiStatus = hasLow ? "Manual Intervention" : hasMedium ? "Medium Confidence" : "Processed";
  const humanReviewRequired = items.some((i) => i.confidence !== "high") || items.length === 0;

  return {
    id: `req-live-${Date.now()}`,
    customer,
    subject: subject || "New Request",
    from: from || "Pasted email",
    receivedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
    emailBody: body,
    aiStatus,
    humanReviewRequired,
    queueStatus: humanReviewRequired ? "Review" : "Ready",
    items,
  };
}
