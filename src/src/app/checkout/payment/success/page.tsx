"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type PaymentStatus = "loading" | "success" | "pending" | "declined" | "error";

interface StatusResponse {
	transactionStatus: "Approved" | "Declined" | "Pending" | "Expired" | "Refunded";
	reason?: string;
}

function PaymentSuccessContent() {
	const searchParams = useSearchParams();
	const checkoutId = searchParams.get("checkout");
	const orderReference = searchParams.get("order");
	const [status, setStatus] = useState<PaymentStatus>("loading");
	const [errorMessage, setErrorMessage] = useState<string>("");

	const checkPaymentStatus = useCallback(async () => {
		if (!orderReference) {
			setStatus("error");
			setErrorMessage("Відсутній номер замовлення");
			return;
		}

		try {
			const response = await fetch(`/api/payment/wayforpay/status/${orderReference}`);

			if (!response.ok) {
				throw new Error("Помилка перевірки статусу");
			}

			const data = (await response.json()) as StatusResponse;

			switch (data.transactionStatus) {
				case "Approved":
					setStatus("success");
					break;
				case "Pending":
					setStatus("pending");
					break;
				case "Declined":
				case "Expired":
					setStatus("declined");
					setErrorMessage(data.reason || "Оплату відхилено");
					break;
				case "Refunded":
					setStatus("error");
					setErrorMessage("Платіж було повернено");
					break;
				default:
					setStatus("pending");
			}
		} catch (error) {
			console.error("Status check error:", error);
			setStatus("pending");
		}
	}, [orderReference]);

	useEffect(() => {
		if (!checkoutId && !orderReference) {
			setStatus("error");
			setErrorMessage("Невірні параметри");
			return;
		}

		checkPaymentStatus();

		const interval = setInterval(() => {
			if (status === "pending" || status === "loading") {
				checkPaymentStatus();
			}
		}, 3000);

		const timeout = setTimeout(() => {
			clearInterval(interval);
			if (status === "loading" || status === "pending") {
				setStatus("pending");
			}
		}, 120000);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [checkoutId, orderReference, checkPaymentStatus, status]);

	if (status === "loading") {
		return (
			<div className="flex min-h-screen items-center justify-center bg-neutral-50">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800" />
					<p className="text-neutral-600">Перевіряємо статус оплати...</p>
				</div>
			</div>
		);
	}

	if (status === "pending") {
		return (
			<div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
				<div className="w-full max-w-md rounded-lg border border-yellow-200 bg-white p-8 text-center shadow-lg">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
						<svg
							className="h-8 w-8 text-yellow-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h1 className="mb-2 text-xl font-semibold text-neutral-900">
						Очікування підтвердження
					</h1>
					<p className="mb-6 text-neutral-600">
						Ваш платіж обробляється. Ви отримаєте підтвердження на email.
					</p>
					<Link
						href="/"
						className="inline-block rounded bg-neutral-800 px-6 py-2 text-neutral-200 hover:bg-neutral-700"
					>
						На головну
					</Link>
				</div>
			</div>
		);
	}

	if (status === "declined" || status === "error") {
		return (
			<div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
				<div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-lg">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<svg
							className="h-8 w-8 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<h1 className="mb-2 text-xl font-semibold text-neutral-900">
						{status === "declined" ? "Оплату відхилено" : "Помилка оплати"}
					</h1>
					<p className="mb-6 text-neutral-600">
						{errorMessage || "Не вдалося обробити платіж. Спробуйте ще раз."}
					</p>
					<Link
						href={checkoutId ? `/checkout?checkout=${checkoutId}` : "/checkout"}
						className="inline-block rounded bg-neutral-800 px-6 py-2 text-neutral-200 hover:bg-neutral-700"
					>
						Повернутися до оформлення
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
			<div className="w-full max-w-md rounded-lg border border-green-200 bg-white p-8 text-center shadow-lg">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<svg
						className="h-8 w-8 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h1 className="mb-2 text-xl font-semibold text-neutral-900">
					Оплата успішна!
				</h1>
				<p className="mb-6 text-neutral-600">
					Дякуємо за ваше замовлення. Ви отримаєте підтвердження на email.
				</p>
				<Link
					href="/"
					className="inline-block rounded bg-neutral-800 px-6 py-2 text-neutral-200 hover:bg-neutral-700"
				>
					На головну
				</Link>
			</div>
		</div>
	);
}

function LoadingFallback() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-neutral-50">
			<div className="text-center">
				<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800" />
				<p className="text-neutral-600">Завантаження...</p>
			</div>
		</div>
	);
}

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<PaymentSuccessContent />
		</Suspense>
	);
}
