import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://asxcrm.com.ua/api/payment/wayforpay";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await fetch(`${BACKEND_URL}/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ message: "Помилка сервера" }))) as { message?: string };
			return NextResponse.json(
				{ message: error.message || "Помилка створення платежу" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("WayForPay create payment error:", error);
		return NextResponse.json(
			{ message: "Помилка створення платежу" },
			{ status: 500 }
		);
	}
}
