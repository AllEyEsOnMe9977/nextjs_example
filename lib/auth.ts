import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "field_notes_publisher";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.PUBLISHER_PASSWORD;
  if (!secret) {
    throw new Error("PUBLISHER_PASSWORD environment variable is not set.");
  }
  return secret;
}

export function createSessionToken(): string {
  const secret = getSecret();
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token || !process.env.PUBLISHER_PASSWORD) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expectedSig = crypto
    .createHmac("sha256", process.env.PUBLISHER_PASSWORD)
    .update(payload)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSig, "utf8");

  if (sigBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

export function verifyPassword(inputPassword: string): boolean {
  const configured = process.env.PUBLISHER_PASSWORD;
  if (!configured || !inputPassword) return false;

  const inputBuf = Buffer.from(inputPassword, "utf8");
  const configBuf = Buffer.from(configured, "utf8");

  if (inputBuf.length !== configBuf.length) return false;
  return crypto.timingSafeEqual(inputBuf, configBuf);
}

export async function isPublisherAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};