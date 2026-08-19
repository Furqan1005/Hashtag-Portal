const COOKIE_NAME = "estrella_showroom_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h shift

export type ShowroomSessionPayload = {
  staffId: string;
  staffName: string;
  iat: number;
};

function secret() {
  const value = process.env.SHOWROOM_SESSION_SECRET;
  if (!value) throw new Error("SHOWROOM_SESSION_SECRET is not set");
  return value;
}

function toBase64Url(bytes: ArrayBuffer) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function timingSafeStringEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

async function sign(payload: string) {
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(signature);
}

export async function createShowroomSessionCookie(staffId: string, staffName: string) {
  const payload: ShowroomSessionPayload = {
    staffId,
    staffName,
    iat: Math.floor(Date.now() / 1000),
  };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const signature = await sign(body);
  return {
    name: COOKIE_NAME,
    value: `${body}.${signature}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    },
  };
}

export async function verifyShowroomSessionValue(
  value: string | undefined
): Promise<ShowroomSessionPayload | null> {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = await sign(body);
  if (!timingSafeStringEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(body))
    ) as ShowroomSessionPayload;
    if (Date.now() / 1000 - payload.iat > MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SHOWROOM_COOKIE_NAME = COOKIE_NAME;
