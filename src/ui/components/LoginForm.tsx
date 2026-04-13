"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saleorAuthClient } from "@/ui/components/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
      const { data } = await saleorAuthClient.signIn({ email, password }, { cache: "no-store" });

      console.log("signIn response:", JSON.stringify({
        token: data?.tokenCreate?.token?.slice(0, 20),
        refreshToken: data?.tokenCreate?.refreshToken?.slice(0, 20),
        errors: data?.tokenCreate?.errors,
      }));

      const errors = data?.tokenCreate?.errors;
      if (errors?.length > 0) {
        setError(errors[0].message || "Невірний email або пароль");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Помилка сервера. Спробуйте пізніше.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-lg">
      <form className="rounded border p-8 shadow-md" onSubmit={handleSubmit}>
        {error && (
          <p className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mb-2">
          <label className="sr-only" htmlFor="email">Електронна пошта</label>
          <input
            type="email"
            name="email"
            placeholder="Електронна пошта"
            className="w-full rounded border bg-neutral-50 px-4 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="sr-only" htmlFor="password">Пароль</label>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            autoCapitalize="off"
            autoComplete="off"
            className="w-full rounded border bg-neutral-50 px-4 py-2"
            required
          />
        </div>
        <button
          className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700 w-full disabled:bg-neutral-500"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}
