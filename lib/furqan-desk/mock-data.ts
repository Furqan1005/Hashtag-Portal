/**
 * Furqan's Desk — prototype/demo mock data.
 *
 * Everything in this file is sample data for demonstrating the concept.
 * It is not read from or written to JEMR, CRM, Zoho, or any Excel file.
 */

export type Confidence = "high" | "medium" | "low";

export type FieldAudit = "ai" | "human";

export type CurrencyCode = "INR" | "EUR" | "CHF";

export interface OrderItem {
  id: string;
  customerStyleNo: string;
  internalDesign: string | null;
  imageVariant: "amber" | "cocoa" | "cream" | "noir";
  /** Real product photo, when one exists (e.g. sourced from a customer's own Excel). Falls back to imageVariant. */
  imageSrc?: string;
  diamondWeight: string | null;
  quantity: number;
  metal: string;
  size: string;
  customerReference: string;
  value: number | null;
  confidence: Confidence;
  status: "Ready for Review" | "Review Required";
  matchReasons: string[];
  fieldAudit: Record<string, FieldAudit>;
}

export interface CustomerRequest {
  id: string;
  customer: string;
  subject: string;
  from: string;
  receivedAt: string;
  emailBody: string;
  aiStatus: "Processed" | "Medium Confidence" | "Manual Intervention";
  humanReviewRequired: boolean;
  queueStatus: "Review" | "Ready";
  items: OrderItem[];
}

const CURRENCY_FORMAT: Record<CurrencyCode, { symbol: string; locale: string }> = {
  INR: { symbol: "₹", locale: "en-IN" },
  EUR: { symbol: "€", locale: "de-DE" },
  CHF: { symbol: "Fr. ", locale: "de-CH" },
};

export const currency = (value: number, code: CurrencyCode = "INR") => {
  const format = CURRENCY_FORMAT[code];
  return `${format.symbol}${value.toLocaleString(format.locale)}`;
};

// ---------------------------------------------------------------------------
// Customer requests / order items
// ---------------------------------------------------------------------------

export const requests: CustomerRequest[] = [
  {
    id: "req-stokkeholm-01",
    customer: "By Stokkeholm",
    subject: "new order",
    from: "Marisa <marisa@bystokkeholm.no>",
    receivedAt: "16 Sep 2026, 09:14",
    emailBody: `Hi
I want to order

1 x R7769 0,50ct yellow gold size 53
ref 66603

1 x R7771 0,25ct white gold size 54
ref 67738

1 x JR08166 yellow gold size 53
ref 67717

Thank you!

Best regards,
Marisa`,
    aiStatus: "Processed",
    humanReviewRequired: true,
    queueStatus: "Review",
    items: [
      {
        id: "item-1",
        customerStyleNo: "R7769",
        internalDesign: "JE02878262",
        imageVariant: "amber",
        diamondWeight: "0.50 ct",
        quantity: 1,
        metal: "Yellow Gold",
        size: "53",
        customerReference: "66603",
        value: 48500,
        confidence: "high",
        status: "Ready for Review",
        matchReasons: [
          "Confirmed mapping in Customer Knowledge (Stokkeholm history)",
          "Product attributes match (ring, diamond setting)",
          "Product image match",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
      {
        id: "item-2",
        customerStyleNo: "R7771",
        internalDesign: "JE02884713",
        imageVariant: "cream",
        diamondWeight: "0.25 ct",
        quantity: 1,
        metal: "White Gold",
        size: "54",
        customerReference: "67738",
        value: 32000,
        confidence: "medium",
        status: "Ready for Review",
        matchReasons: [
          "Similar reference mapping found (R77xx family)",
          "Product attributes match (ring style, size range)",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
      {
        id: "item-3",
        customerStyleNo: "JR08166",
        internalDesign: null,
        imageVariant: "noir",
        diamondWeight: null,
        quantity: 1,
        metal: "Yellow Gold",
        size: "53",
        customerReference: "67717",
        value: null,
        confidence: "low",
        status: "Review Required",
        matchReasons: [
          "No confirmed mapping in Customer Knowledge for this style prefix",
          "No confident catalogue match — manual lookup required",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
    ],
  },
  {
    id: "req-customerb-01",
    customer: "Customer B",
    subject: "Order — restock",
    from: "orders@customerb.example",
    receivedAt: "16 Sep 2026, 08:02",
    emailBody: `Hi team,

Please process the restock order below, same as our usual sizes.

8 pieces total across our standard line — details as per the attached style sheet (LBC078267 and related refs).

Thanks,
Procurement`,
    aiStatus: "Processed",
    humanReviewRequired: false,
    queueStatus: "Ready",
    items: [
      {
        id: "item-b1",
        customerStyleNo: "LBC078267",
        internalDesign: "JE02878262",
        imageVariant: "cocoa",
        diamondWeight: "0.40 ct",
        quantity: 4,
        metal: "Yellow Gold",
        size: "52",
        customerReference: "B-2291",
        value: 45200,
        confidence: "high",
        status: "Ready for Review",
        matchReasons: [
          "Confirmed mapping in Customer Knowledge (saved 04 Sep 2026)",
          "Customer history match",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
      {
        id: "item-b2",
        customerStyleNo: "LBC078311",
        internalDesign: "JE02884502",
        imageVariant: "amber",
        diamondWeight: "0.35 ct",
        quantity: 4,
        metal: "Rose Gold",
        size: "50",
        customerReference: "B-2292",
        value: 41800,
        confidence: "high",
        status: "Ready for Review",
        matchReasons: [
          "Confirmed mapping in Customer Knowledge",
          "Product attributes match",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
    ],
  },
  {
    id: "req-customerc-01",
    customer: "Customer C",
    subject: "Quotation request",
    from: "buying@customerc.example",
    receivedAt: "15 Sep 2026, 17:41",
    emailBody: `Hello,

Could you quote CTS 0.60 on the below 4 styles? Also confirm Pt availability for CC-991.

Awaiting your reply.`,
    aiStatus: "Medium Confidence",
    humanReviewRequired: true,
    queueStatus: "Review",
    items: [
      {
        id: "item-c1",
        customerStyleNo: "CC-991",
        internalDesign: "JE02890114",
        imageVariant: "noir",
        diamondWeight: "0.60 ct",
        quantity: 2,
        metal: "Platinum",
        size: "56",
        customerReference: "C-Q-1145",
        value: null,
        confidence: "medium",
        status: "Review Required",
        matchReasons: [
          "Product attributes match (ring family)",
          "Platinum pricing not available in primary source — see Exceptions",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
      {
        id: "item-c2",
        customerStyleNo: "CC-772",
        internalDesign: "JE02891920",
        imageVariant: "cream",
        diamondWeight: "0.60 ct",
        quantity: 2,
        metal: "White Gold",
        size: "54",
        customerReference: "C-Q-1146",
        value: 38400,
        confidence: "medium",
        status: "Ready for Review",
        matchReasons: ["Product attributes match", "Similar reference mapping found"],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
    ],
  },
  {
    // Seeded from a real file the user shared: DIARA20260914_3.xlsx, a
    // 102-line production/price sheet with embedded product photography.
    // The three items below (and their photos) are copied from that
    // sheet, not invented — see lib/furqan-desk/mock-data.ts jemrData
    // entries for the exact source rows.
    id: "req-diara-01",
    customer: "Diara",
    subject: "Diara production sheet — DIARA20260914_3.xlsx",
    from: "Diara collection — internal reference file (no cover email)",
    receivedAt: "14 Sep 2026, 18:30",
    emailBody: `Reference file: DIARA20260914_3.xlsx (102 lines, embedded product photos)

Lines flagged for this workspace:

Line 1 — 4x J4105R01883, DS2040G/52
14k yellow gold, 0.14ct lab-grown diamonds (F/VS1)
€599 each

Line 4 — 3x J4105R01217, DS2049W/52
14k white gold, 0.36ct lab-grown diamonds (F/VS1)
€899 each

Line 12 — 2x J4105R01248, DS2063G/54
14k yellow gold, 1.20ct lab-grown diamonds (F/VS1)
€1,999 each`,
    aiStatus: "Processed",
    humanReviewRequired: false,
    queueStatus: "Ready",
    items: [
      {
        id: "item-diara-1",
        customerStyleNo: "J4105R01883",
        internalDesign: "DS2040G/52",
        imageVariant: "amber",
        imageSrc: "/furqan-desk/diara/DS2040G-52.png",
        diamondWeight: "0.14 ct",
        quantity: 4,
        metal: "Yellow Gold",
        size: "52",
        customerReference: "Line 1",
        value: 599,
        confidence: "high",
        status: "Ready for Review",
        matchReasons: [
          "Exact Item No. match in Diara's own production sheet (DIARA20260914_3.xlsx)",
          "Confirmed mapping in Customer Knowledge (saved 14 Sep 2026)",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
      {
        id: "item-diara-2",
        customerStyleNo: "J4105R01217",
        internalDesign: "DS2049W/52",
        imageVariant: "cream",
        imageSrc: "/furqan-desk/diara/DS2049W-52.png",
        diamondWeight: "0.36 ct",
        quantity: 3,
        metal: "White Gold",
        size: "52",
        customerReference: "Line 4",
        value: 899,
        confidence: "high",
        status: "Ready for Review",
        matchReasons: [
          "Exact Item No. match in Diara's own production sheet (DIARA20260914_3.xlsx)",
          "Confirmed mapping in Customer Knowledge (saved 14 Sep 2026)",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
      {
        id: "item-diara-3",
        customerStyleNo: "J4105R01248",
        internalDesign: "DS2063G/54",
        imageVariant: "cocoa",
        imageSrc: "/furqan-desk/diara/DS2063G-54.png",
        diamondWeight: "1.20 ct",
        quantity: 2,
        metal: "Yellow Gold",
        size: "54",
        customerReference: "Line 12",
        value: 1999,
        confidence: "high",
        status: "Ready for Review",
        matchReasons: [
          "Exact Item No. match in Diara's own production sheet (DIARA20260914_3.xlsx)",
          "Confirmed mapping in Customer Knowledge (saved 14 Sep 2026)",
        ],
        fieldAudit: {
          customerStyleNo: "ai",
          internalDesign: "ai",
          diamondWeight: "ai",
          quantity: "ai",
          metal: "ai",
          size: "ai",
          customerReference: "ai",
          value: "ai",
        },
      },
    ],
  },
];

export const getRequest = (id: string) => requests.find((r) => r.id === id);

// ---------------------------------------------------------------------------
// Customer-specific knowledge
// ---------------------------------------------------------------------------

export interface CustomerKnowledge {
  customer: string;
  terminology: { term: string; meaning: string; note?: string }[];
  confirmedMappings: { customerStyle: string; internalDesign: string; confirmedOn: string }[];
  requestPattern: string[];
}

export const customerKnowledge: CustomerKnowledge[] = [
  {
    customer: "By Stokkeholm",
    terminology: [
      { term: "CS", meaning: "Color Stone" },
      { term: "CST", meaning: "Color Stone" },
      { term: "CTS", meaning: "Could refer to carat/weight, depending on context", note: "Ambiguous — confirm meaning per request" },
      { term: "Qty", meaning: "Quantity" },
      { term: "Ref", meaning: "Customer Reference" },
      { term: "Dia Wt", meaning: "Diamond Weight" },
    ],
    confirmedMappings: [
      { customerStyle: "LBC078267", internalDesign: "JE02878262", confirmedOn: "04 Sep 2026" },
      { customerStyle: "R7769", internalDesign: "JE02878262", confirmedOn: "12 Sep 2026" },
    ],
    requestPattern: [
      "Style number",
      "Diamond weight",
      "Metal",
      "Size",
      "Customer reference",
    ],
  },
  {
    customer: "Customer B",
    terminology: [
      { term: "Pcs", meaning: "Quantity" },
      { term: "Ref#", meaning: "Customer Reference" },
    ],
    confirmedMappings: [
      { customerStyle: "LBC078267", internalDesign: "JE02878262", confirmedOn: "01 Aug 2026" },
      { customerStyle: "LBC078311", internalDesign: "JE02884502", confirmedOn: "01 Aug 2026" },
    ],
    requestPattern: ["Style number", "Metal", "Size", "Reference"],
  },
  {
    customer: "Customer C",
    terminology: [
      { term: "CTS", meaning: "Carat (weight)", note: "Confirmed for this customer — differs from Stokkeholm" },
      { term: "Pt", meaning: "Platinum" },
    ],
    confirmedMappings: [{ customerStyle: "CC-772", internalDesign: "JE02891920", confirmedOn: "22 Aug 2026" }],
    requestPattern: ["Style number", "Carat weight", "Metal", "Reference"],
  },
  {
    customer: "Diara",
    terminology: [
      { term: "Item No.", meaning: "Customer Style Number (Diara's own SKU)" },
      { term: "Artikelnummer", meaning: "Internal Design (Estrella's article number)" },
      { term: "WG(g)", meaning: "Metal Weight, in grams" },
    ],
    confirmedMappings: [
      { customerStyle: "J4105R01883", internalDesign: "DS2040G/52", confirmedOn: "14 Sep 2026" },
      { customerStyle: "J4105R01217", internalDesign: "DS2049W/52", confirmedOn: "14 Sep 2026" },
      { customerStyle: "J4105R01162", internalDesign: "DS2051G/54", confirmedOn: "14 Sep 2026" },
      { customerStyle: "J4105R01248", internalDesign: "DS2063G/54", confirmedOn: "14 Sep 2026" },
      { customerStyle: "J4105R01256", internalDesign: "DS2067G/54", confirmedOn: "14 Sep 2026" },
      { customerStyle: "J4105BR00066", internalDesign: "DS3400G", confirmedOn: "14 Sep 2026" },
    ],
    requestPattern: ["Item No.", "Artikelnummer", "Material", "Carat weight", "Quantity"],
  },
];

export const getKnowledge = (customer: string) =>
  customerKnowledge.find((k) => k.customer === customer);

// ---------------------------------------------------------------------------
// JEMR mock data
// ---------------------------------------------------------------------------

export interface JemrRecord {
  designNo: string;
  metal: string;
  kt: string;
  metalWeight: string;
  diamondWeight: string;
  colorStoneWeight: string;
  currentPricing: string;
  other: string;
  /** Where this record was seeded from, when it traces back to a real file rather than an invented example. */
  source?: string;
}

export const jemrData: Record<string, JemrRecord> = {
  JE02878262: {
    designNo: "JE02878262",
    metal: "Yellow Gold",
    kt: "18KT",
    metalWeight: "3.2 g",
    diamondWeight: "0.50 ct",
    colorStoneWeight: "—",
    currentPricing: "₹48,500 (base, size 53)",
    other: "Ring · Solitaire setting · Polished finish",
  },
  JE02884713: {
    designNo: "JE02884713",
    metal: "White Gold",
    kt: "18KT",
    metalWeight: "2.9 g",
    diamondWeight: "0.25 ct",
    colorStoneWeight: "—",
    currentPricing: "₹32,000 (base, size 54)",
    other: "Ring · Pavé band · Rhodium plated",
  },
  JE02884502: {
    designNo: "JE02884502",
    metal: "Rose Gold",
    kt: "18KT",
    metalWeight: "3.0 g",
    diamondWeight: "0.35 ct",
    colorStoneWeight: "—",
    currentPricing: "₹41,800 (base, size 50)",
    other: "Ring · Halo setting",
  },
  JE02890114: {
    designNo: "JE02890114",
    metal: "Platinum",
    kt: "950 Pt",
    metalWeight: "5.1 g",
    diamondWeight: "0.60 ct",
    colorStoneWeight: "—",
    currentPricing: "Pending — Platinum pricing not in primary source",
    other: "Ring · Bezel setting",
  },
  JE02891920: {
    designNo: "JE02891920",
    metal: "White Gold",
    kt: "18KT",
    metalWeight: "3.4 g",
    diamondWeight: "0.60 ct",
    colorStoneWeight: "—",
    currentPricing: "₹38,400 (base, size 54)",
    other: "Ring · Three-stone setting",
  },

  // Diara — seeded from the customer's own real production/price sheet
  // (DIARA20260914_3.xlsx), uploaded to validate the prototype against
  // actual data. Values below are copied from that file, not invented.
  "DS2040G/52": {
    designNo: "DS2040G/52",
    metal: "Yellow Gold",
    kt: "14KT (585/-)",
    metalWeight: "1.176 g",
    diamondWeight: "0.14 ct",
    colorStoneWeight: "—",
    currentPricing: "€599",
    other: "Ring · F/VS1 lab-grown diamonds",
    source: "DIARA20260914_3.xlsx, row 2",
  },
  "DS2049W/52": {
    designNo: "DS2049W/52",
    metal: "White Gold",
    kt: "14KT (585/-)",
    metalWeight: "1.523 g",
    diamondWeight: "0.36 ct",
    colorStoneWeight: "—",
    currentPricing: "€899",
    other: "Ring · F/VS1 lab-grown diamonds",
    source: "DIARA20260914_3.xlsx, row 5",
  },
  "DS2051G/54": {
    designNo: "DS2051G/54",
    metal: "Yellow Gold",
    kt: "14KT (585/-)",
    metalWeight: "1.313 g",
    diamondWeight: "0.27 ct",
    colorStoneWeight: "—",
    currentPricing: "€699",
    other: "Ring · F/VS1 lab-grown diamonds",
    source: "DIARA20260914_3.xlsx, row 7",
  },
  "DS2063G/54": {
    designNo: "DS2063G/54",
    metal: "Yellow Gold",
    kt: "14KT (585/-)",
    metalWeight: "2.73 g",
    diamondWeight: "1.20 ct",
    colorStoneWeight: "—",
    currentPricing: "€1,999",
    other: "Ring · F/VS1 lab-grown diamonds",
    source: "DIARA20260914_3.xlsx, row 13",
  },
  "DS2067G/54": {
    designNo: "DS2067G/54",
    metal: "Yellow Gold",
    kt: "14KT (585/-)",
    metalWeight: "1.82 g",
    diamondWeight: "0.75 ct",
    colorStoneWeight: "—",
    currentPricing: "€1,490",
    other: "Ring · F/VS1 lab-grown diamonds",
    source: "DIARA20260914_3.xlsx, row 16",
  },
  DS3400G: {
    designNo: "DS3400G",
    metal: "Yellow Gold",
    kt: "14KT (585/-)",
    metalWeight: "6.49 g",
    diamondWeight: "3.00 ct",
    colorStoneWeight: "—",
    currentPricing: "€3,499",
    other: "Bracelet · 18cm · F/VS1 lab-grown diamonds",
    source: "DIARA20260914_3.xlsx, row 26",
  },
};

// ---------------------------------------------------------------------------
// Customer-specific pricing
// ---------------------------------------------------------------------------

export interface CustomerPricing {
  customer: string;
  currency?: CurrencyCode;
  labour: string;
  diamond: string;
  labDiamond: string;
  colorStone: string;
  metal: string;
  platinum: string | null;
}

export const customerPricing: CustomerPricing[] = [
  {
    customer: "By Stokkeholm",
    labour: "₹1,850 / g (JEMR labour rate)",
    diamond: "₹42,000 / ct (VS-GH)",
    labDiamond: "₹18,500 / ct (VS-GH)",
    colorStone: "Per stone, quoted on request",
    metal: "Live gold rate + 4% (18KT)",
    platinum: null,
  },
  {
    customer: "Customer B",
    labour: "₹1,700 / g (JEMR labour rate)",
    diamond: "₹40,500 / ct (VS-GH)",
    labDiamond: "₹17,800 / ct (VS-GH)",
    colorStone: "Per stone, quoted on request",
    metal: "Live gold rate + 3.5% (18KT)",
    platinum: "₹3,650 / g (secondary sheet)",
  },
  {
    customer: "Customer C",
    labour: "₹1,900 / g (JEMR labour rate)",
    diamond: "₹43,200 / ct (VS-GH)",
    labDiamond: "₹19,100 / ct (VS-GH)",
    colorStone: "Per stone, quoted on request",
    metal: "Live gold rate + 4.5% (18KT)",
    platinum: null,
  },
  {
    customer: "Diara",
    currency: "EUR",
    labour: "Bundled into finished-piece price — not itemized separately in Diara's sheet",
    diamond: "Included — lab-grown diamonds, F colour / VS1 clarity",
    labDiamond: "Included in the finished-piece price shown per Artikelnummer",
    colorStone: "—",
    metal: "Included in finished-piece price (14KT / 585)",
    platinum: null,
  },
];

export const getPricing = (customer: string) =>
  customerPricing.find((p) => p.customer === customer);

/** Real catalogue photos, keyed by internal design — used when live email
 *  intake matches a design that has one (e.g. seeded Diara designs). */
export const catalogueImages: Record<string, string> = {
  "DS2040G/52": "/furqan-desk/diara/DS2040G-52.png",
  "DS2049W/52": "/furqan-desk/diara/DS2049W-52.png",
  "DS2051G/54": "/furqan-desk/diara/DS2051G-54.png",
  "DS2063G/54": "/furqan-desk/diara/DS2063G-54.png",
  "DS2067G/54": "/furqan-desk/diara/DS2067G-54.png",
  DS3400G: "/furqan-desk/diara/DS3400G.png",
};

export const secondaryPlatinumPricing = {
  source: "Platinum Pricing Sheet (secondary, maintained separately)",
  rate: "₹3,720 / g",
  lastUpdated: "10 Sep 2026",
  note: "Not yet consolidated into the primary customer pricing sheet for By Stokkeholm or Customer C.",
};

// ---------------------------------------------------------------------------
// AI learning / confirmation history
// ---------------------------------------------------------------------------

export interface LearningEntry {
  date: string;
  customer: string;
  suggestionFrom: string;
  suggestionTo: string;
  humanAction: "Confirmed" | "Rejected" | "Corrected";
  correctedTo?: string;
  status: string;
}

export const learningHistory: LearningEntry[] = [
  {
    date: "14 Sep 2026",
    customer: "Diara",
    suggestionFrom: "J4105R01883",
    suggestionTo: "DS2040G/52",
    humanAction: "Confirmed",
    status: "Saved to Customer Knowledge — sourced from DIARA20260914_3.xlsx",
  },
  {
    date: "04 Sep 2026",
    customer: "By Stokkeholm",
    suggestionFrom: "LBC078267",
    suggestionTo: "JE02878262",
    humanAction: "Confirmed",
    status: "Saved to Customer Knowledge",
  },
  {
    date: "12 Sep 2026",
    customer: "By Stokkeholm",
    suggestionFrom: "R7769",
    suggestionTo: "JE02878262",
    humanAction: "Confirmed",
    status: "Saved to Customer Knowledge",
  },
  {
    date: "22 Aug 2026",
    customer: "Customer C",
    suggestionFrom: "CC-772",
    suggestionTo: "JE02891920",
    humanAction: "Confirmed",
    status: "Saved to Customer Knowledge",
  },
  {
    date: "18 Aug 2026",
    customer: "Customer C",
    suggestionFrom: "CC-410",
    suggestionTo: "JE02870044",
    humanAction: "Corrected",
    correctedTo: "JE02870091",
    status: "Correction saved to Customer Knowledge",
  },
  {
    date: "01 Aug 2026",
    customer: "Customer B",
    suggestionFrom: "LBC078311",
    suggestionTo: "JE02884502",
    humanAction: "Confirmed",
    status: "Saved to Customer Knowledge",
  },
];

// ---------------------------------------------------------------------------
// Exceptions
// ---------------------------------------------------------------------------

export const exceptions = {
  missingDesign: [
    {
      customer: "By Stokkeholm",
      customerStyle: "JR08166",
      status: "No confident internal match",
      requestId: "req-stokkeholm-01",
      itemId: "item-3",
    },
  ],
  missingPricing: [
    {
      customer: "By Stokkeholm",
      product: "Platinum",
      status: "Primary pricing unavailable",
    },
    {
      customer: "Customer C",
      product: "Platinum (CC-991)",
      status: "Primary pricing unavailable",
    },
  ],
  ambiguousTerminology: [
    {
      customer: "By Stokkeholm",
      term: "CTS",
      possibleMeanings: ["Carat (weight)", "Color Stone", "Other"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Dashboard metrics (demo only)
// ---------------------------------------------------------------------------

export const dashboardMetrics = {
  todaysRequests: 12,
  aiProcessed: 9,
  awaitingReview: 3,
  manualIntervention: 2,
  knowledgeMappings: 126,
  timeSavedLabel: "~2.5 hrs today (demo estimate)",
};
