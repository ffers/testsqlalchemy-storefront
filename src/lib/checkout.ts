import { cookies } from "next/headers";
import { CheckoutCreateDocument, CheckoutFindDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const CHANNEL = process.env.NEXT_PUBLIC_SALEOR_CHANNEL_SLUG || "ua";
const COOKIE_NAME = `checkoutId-${CHANNEL}`;

export async function getIdFromCookies() {
	const checkoutId = (await cookies()).get(COOKIE_NAME)?.value || "";
	return checkoutId;
}

export async function saveIdToCookie(checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	(await cookies()).set(COOKIE_NAME, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function find(checkoutId: string) {
	try {
		const { checkout } = checkoutId
			? await executeGraphQL(CheckoutFindDocument, {
					variables: {
						id: checkoutId,
					},
					cache: "no-cache",
				})
			: { checkout: null };

		return checkout;
	} catch {
		// we ignore invalid ID or checkout not found
	}
}

export async function findOrCreate({ checkoutId }: { checkoutId?: string }) {
	if (!checkoutId) {
		return (await create()).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create()).checkoutCreate?.checkout;
}

export const create = () =>
	executeGraphQL(CheckoutCreateDocument, { cache: "no-cache", variables: { channel: CHANNEL } });
