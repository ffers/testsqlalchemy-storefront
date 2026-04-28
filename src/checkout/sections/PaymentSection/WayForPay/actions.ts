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

	// Якщо є orderId (замовлення вже створено) — передаємо його, не checkoutId
	const body = orderId ? { orderId } : { checkoutId };

	const response = await fetch(`${crmApiUrl}/api/payment/wayforpay/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `${token}`,
		},
		body: JSON.stringify(body),
		cache: "no-store",
	});

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
