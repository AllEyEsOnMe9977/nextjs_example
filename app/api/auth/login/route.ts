import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  verifyPassword,
} from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    if (!process.env.PUBLISHER_PASSWORD) {
      return NextResponse.json(
        { error: "PUBLISHER_PASSWORD is not configured on the server." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid publisher password." },
        { status: 401 },
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to process login request." },
      { status: 400 },
    );
  }
}