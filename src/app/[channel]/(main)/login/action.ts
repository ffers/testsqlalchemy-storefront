"use server";

import { getServerAuthClient } from "@/app/config";

console.log("NEXT_PUBLIC_STOREFRONT_URL:", process.env.NEXT_PUBLIC_STOREFRONT_URL);
console.log("NEXT_PUBLIC_SALEOR_API_URL:", process.env.NEXT_PUBLIC_SALEOR_API_URL);

export type LoginState = { error: string } | { success: true } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Введіть email та пароль" };
  }

  try {
    const authClient = await getServerAuthClient();

    const { data } = await authClient.signIn(
      { email, password },
      { cache: "no-store" }
    );

    const errors = data?.tokenCreate?.errors;
    if (errors?.length > 0) {
      return { error: errors[0].message || "Невірний email або пароль" };
    }
  } catch {
    return { error: "Помилка сервера. Спробуйте пізніше." };
  }

  return { success: true };
}