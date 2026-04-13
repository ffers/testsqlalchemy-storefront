import { NextRequest, NextResponse } from "next/server";

const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://asxcrm.com.ua";
const BACKEND_URL = `${CRM_API_URL}/api/payment/wayforpay`;

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ orderReference: string }> }
) {
	try {
		const { orderReference } = await params;

		if (!orderReference) {
			return NextResponse.json(
				{ message: "Order reference is required" },
				{ status: 400 }
			);
		}

		const response = await fetch(`${BACKEND_URL}/status/${orderReference}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ message: "Status check error" }))) as { message?: string };
			return NextResponse.json(
				{ message: error.message || "Помилка перевірки статусу" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("WayForPay status check error:", error);
		return NextResponse.json(
			{ message: "Помилка перевірки статусу" },
			{ status: 500 }
		);
	}
}
