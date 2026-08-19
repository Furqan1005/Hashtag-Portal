import bcrypt from "bcryptjs";

/** Node-only (bcrypt) — call from Route Handlers, never from Edge middleware. */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}
