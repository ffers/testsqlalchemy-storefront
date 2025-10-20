import { getServerAuthClient } from "@/app/config";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export async function LoginForm() {
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form
				className="rounded border p-8 shadow-md"
				action={async (formData) => {
					"use server";

					const email = formData.get("email")?.toString();
					const password = formData.get("password")?.toString();

					if (!email || !password) {
						throw new Error("Email and password are required");
					}

					const { data } = await (
						await getServerAuthClient()
					).signIn({ email, password }, { cache: "no-store" });

					console.log("LOGIN RESPONSE:", data); // 👉 побачиш у логах, що GraphQL відповідає

                    if (data?.tokenCreate?.errors?.length) {
                    console.error("LOGIN ERRORS:", data.tokenCreate.errors);
                    throw new Error(data.tokenCreate.errors[0].message || "Login failed");
                    }
                    if (data?.tokenCreate?.token) {
  const h = headers();
  const c = cookies();
  const host = (h.get("host") || "jemis.com.ua").split(":")[0];
  const https = (h.get("x-forwarded-proto") || "https") === "https";

  c.set("saleorAccessToken", data?.tokenCreate?.token, {
    httpOnly: true,
    secure: https,
    sameSite: "lax",
    domain: host,
    path: "/",
    maxAge: 15 * 60,
  });

  c.set("saleorRefreshToken", data?.tokenCreate?.refreshToken, {
    httpOnly: true,
    secure: https,
    sameSite: "lax",
    domain: host,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });


                    // можеш зберегти токен у cookies, якщо потрібно
                    redirect("/"); // або "/", або куди потрібно
                    }

                    // ✅ головне — щоб React не ламався
                    return; 
				}}
			>
				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Електронна пошта
					</label>
					<input
						type="email"
						name="email"
						placeholder="Електронна пошта"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Пароль
					</label>
					<input
						type="password"
						name="password"
						placeholder="Пароль"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>

				<button
					className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
					type="submit"
				>
					Увійти
				</button>
			</form>
			<div></div>
		</div>
	);
}
