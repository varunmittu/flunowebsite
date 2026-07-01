import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = () => new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fluno-admin-secret-change-this"
);

export const ADMIN_COOKIE = "fluno_admin";

export async function signAdminToken(email: string) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret());
  return payload as { email: string; role: string };
}

export async function getAdminSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
