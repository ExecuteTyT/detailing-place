import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { adminUsers } from "./db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "dp_admin_session";
const MAX_AGE = 60 * 60 * 24; // 24 hours

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || "detailing-place-default-jwt-secret-change-me";
  return new TextEncoder().encode(secret);
}

// ── Rate Limiting ──

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false;
  }

  entry.count++;
  return true;
}

// ── JWT ──

export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

// ── Login / Logout ──

export async function login(
  username: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  const user = db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .get();

  if (!user) {
    return { success: false, error: "Неверный логин или пароль" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Неверный логин или пароль" };
  }

  const token = await createToken(username);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
