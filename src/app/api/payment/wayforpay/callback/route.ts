import { NextRequest, NextResponse } from "next/server";

const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://asxcrm.com.ua";
const BACKEND_URL = `${CRM_API_URL}/api/payment/wayforpay`;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await fetch(`${BACKEND_URL}/callback`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ message: "Callback error" }))) as { message?: string };
			return NextResponse.json(
				{ message: error.message || "Callback processing error" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("WayForPay callback error:", error);
		return NextResponse.json(
			{ message: "Callback processing error" },
			{ status: 500 }
		);
	}
}
