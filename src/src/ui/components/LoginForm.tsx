"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/[channel]/(main)/login/action";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state && "success" in state) {
      router.push("/");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="mx-auto mt-16 w-full max-w-lg">
      <form
        className="rounded border p-8 shadow-md"
        action={formAction}
      >
        {state && "error" in state && (
          <p className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">{state.error}</p>
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