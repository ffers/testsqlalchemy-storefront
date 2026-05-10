"use server";

import { type WayForPayCreateResponse } from "./types";

export async function createWayForPayPayment(
	checkoutId: string,
	orderId?: string,
): Promise<WayForPayCreateResponse> {
	const crmApiUrl = process.env.NEXT_PUBLIC_CRM_API_URL || "https://asxcrm.com.ua";
	const token = process.env.ASXCRM_APP_TOKEN;

	if (!token) {
		return { success: false, error: "Токен не налаштовано" };
	}

	const body = orderId ? { orderId } : { checkoutId };

	let response: Response;
	try {
		response = await fetch(`${crmApiUrl}/api/payment/wayforpay/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${token}`,
			},
			body: JSON.stringify(body),
			cache: "no-store",
		});
	} catch (err) {
		return { success: false, error: `Не вдалось звʼязатись з сервером оплати: ${String(err)}` };
	}

	const contentType = response.headers.get("content-type") ?? "";
	const isJson = contentType.includes("application/json");

	if (!isJson) {
		const text = await response.text();
		console.error("[WayForPay] Unexpected response (not JSON):", response.status, text.slice(0, 300));
		return { success: false, error: `Неочікувана відповідь від сервера (${response.status})` };
	}

	if (!response.ok) {
		const errorData = (await response.json()) as { detail?: string | { error?: string } };
		const msg =
			typeof errorData.detail === "string"
				? errorData.detail
				: (errorData.detail?.error ?? "Помилка створення платежу");
		return { success: false, error: msg };
	}

	return response.json() as Promise<WayForPayCreateResponse>;
}
