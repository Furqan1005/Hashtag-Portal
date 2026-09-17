/**
 * Shared "AI prepares a request" assembly step — turns a list of parsed
 * line items (however they were extracted: pasted email text, an uploaded
 * Excel sheet, or text pulled from a PDF) into a CustomerRequest the rest
 * of Estrella's Autopilot already knows how to render.
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

// Style numbers a real customer might reuse from the demo catalogue, so the
// live intake flow can show the same high/medium-confidence matches as the
// seeded requests when the input overlaps with them.
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
  /** Internal design, when the source already states it explicitly (e.g. an
   *  Excel "Artikelnummer" column) rather than something to match. */
  internalDesignHint?: string | null;
  /** Value, when the source already states it explicitly (e.g. an Excel
   *  "Price" column) rather than something to look up in JEMR. */
  valueHint?: number | null;
}

export function imageVariantFor(styleNo: string) {
  let hash = 0;
  for (const ch of styleNo) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return IMAGE_VARIANTS[hash % IMAGE_VARIANTS.length];
}

export interface DesignMatch {
  internalDesign: string | null;
  confidence: Confidence;
  reasons: string[];
}

export function matchDesign(
  customer: string,
  styleNo: string,
  hint?: { internalDesign?: string | null }
): DesignMatch {
  // An explicit internal design straight from the source (e.g. the
  // customer's own Excel already lists their internal Artikelnummer) is the
  // strongest possible evidence — no lookup needed.
  if (hint?.internalDesign) {
    return {
      internalDesign: hint.internalDesign,
      confidence: "high",
      reasons: ["Internal design stated directly in the source file", "No lookup required"],
    };
  }

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
  rawContent,
  items: parsed,
}: {
  customer: string;
  subject: string;
  from: string;
  /** What renders in the "Original Request" panel — raw email text, or a
   *  readable summary of an imported file's rows. */
  rawContent: string;
  items: ParsedLineItem[];
}): CustomerRequest {
  const items: OrderItem[] = parsed.map((p, i) => {
    const match = matchDesign(customer, p.customerStyleNo, { internalDesign: p.internalDesignHint });
    const value = p.valueHint ?? estimateValue(match.internalDesign);
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
    emailBody: rawContent,
    aiStatus,
    humanReviewRequired,
    queueStatus: humanReviewRequired ? "Review" : "Ready",
    items,
  };
}
