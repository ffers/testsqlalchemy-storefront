"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerAuthClient } from "@/app/config"; // або твій шлях

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) throw new Error("Email and password are required");

  const auth = await getServerAuthClient();
  const { data } = await auth.signIn({ email, password }, { cache: "no-store" });

  const token = data?.tokenCreate?.token;
  const refresh = data?.tokenCreate?.refreshToken;
  const errs = data?.tokenCreate?.errors;

  if (errs?.length) throw new Error(errs[0].message || "Login failed");
  if (!token || !refresh) throw new Error("Missing tokens");

  // --- вручну ставимо куки ---
  const h = headers();
  const c = cookies();
  const host = (h.get("host") || "jemis.com.ua").split(":")[0];
  const https = (h.get("x-forwarded-proto") || "https") === "https";

  c.set("saleorAccessToken", token, {
    httpOnly: true,
    secure: https,
    sameSite: "lax",
    domain: host,
    path: "/",
    maxAge: 15 * 60,
  });

  c.set("saleorRefreshToken", refresh, {
    httpOnly: true,
    secure: https,
    sameSite: "lax",
    domain: host,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  redirect("/"); // або /account /dashboard
}