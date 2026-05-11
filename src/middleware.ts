import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["uk", "ua", "en"];
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

	const firstSegment = pathname.split("/")[1] ?? "";

	// Підтримуваний locale — пропускаємо
	if (SUPPORTED_LOCALES.includes(firstSegment)) {
		return NextResponse.next();
	}

	// Схоже на locale (2-3 літери) але не підтримується — пропускаємо,
	// layout зробить notFound()
	if (/^[a-z]{2,3}$/.test(firstSegment)) {
		return NextResponse.next();
	}

	// Немає префіксу locale — редіректимо на дефолтний
	const url = request.nextUrl.clone();
	url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
