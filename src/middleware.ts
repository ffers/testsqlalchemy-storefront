import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["uk", "en"];
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "uk";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Пропускаємо статику, api, _next, checkout
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/static") ||
		pathname.startsWith("/checkout") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	// Перевіряємо чи починається шлях з підтримуваного locale
	const firstSegment = pathname.split("/")[1];
	if (SUPPORTED_LOCALES.includes(firstSegment)) {
		return NextResponse.next();
	}

	// Редіректимо на дефолтний locale
	const url = request.nextUrl.clone();
	url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
