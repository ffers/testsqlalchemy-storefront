"use server";

import { getServerAuthClient } from "@/app/config";

export async function logout() {
	"use server";
	(await getServerAuthClient()).signOut();
}


export async function signInAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data } = await (
    await getServerAuthClient()
  ).signIn({ email, password }, { cache: "no-store" });

  return data;
}
