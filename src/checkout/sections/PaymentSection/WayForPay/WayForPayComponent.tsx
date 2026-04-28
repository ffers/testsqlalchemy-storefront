"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/checkout/components";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useUser } from "@/checkout/hooks/useUser";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { type WayForPayConfig, type WayForPayResponse } from "./types";
import { createWayForPayPayment } from "./actions";

interface WayForPayComponentProps {
	config: WayForPayConfig;
}

export const WayForPayComponent = ({ config: _config }: WayForPayComponentProps) => {
	const { checkout } = useCheckout();
	const { user } = useUser();
	const { showCustomErrors, showSuccess } = useAlerts();
	const router = useRouter();

	const [isProcessing, setIsProcessing] = useState(false);
	// Зберігаємо orderId після першого /create щоб повторна оплата йшла через orderId
	const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
	const [orderNo, setOrderNo] = useState<string | null>(null);

	// Гарантовано скидаємо processing коли входимо в стан "замовлення очікує оплати"
	useEffect(() => {
		if (pendingOrderId) {
			setIsProcessing(false);
		}
	}, [pendingOrderId]);

	const validateCheckout = useCallback((): boolean => {
		const errors: string[] = [];

		if (!checkout?.email) {
			errors.push("Введіть email");
		}

		if (!checkout?.shippingAddress) {
			errors.push(user ? "Оберіть адресу доставки у вашому профілі" : "Введіть адресу доставки");
		} else {
			if (!checkout.shippingAddress.firstName) {
				errors.push(user ? "Додайте ім'я в адресу профілю" : "Введіть ім'я");
			}
			if (!checkout.shippingAddress.lastName) {
				errors.push(user ? "Додайте прізвище в адресу профілю" : "Введіть прізвище");
			}
			if (!checkout.shippingAddress.phone) {
				errors.push(user ? "Додайте номер телефону в адресу профілю" : "Введіть номер телефону");
			}
			if (!checkout.shippingAddress.streetAddress1) {
				errors.push(user ? "Додайте вулицю в адресу профілю" : "Введіть адресу");
			}
			if (!checkout.shippingAddress.city) {
				errors.push(user ? "Додайте місто в адресу профілю" : "Введіть місто");
			}
		}

		if (!checkout?.deliveryMethod) {
			errors.push("Оберіть спосіб доставки");
		}

		if (errors.length > 0) {
			showCustomErrors(errors.map((message) => ({ message })));
			return false;
		}

		return true;
	}, [checkout, user, showCustomErrors]);

	const runWidget = useCallback(
		(paymentData: Awaited<ReturnType<typeof createWayForPayPayment>>["data"], orderId: string) => {
			if (!paymentData) return;

			if (typeof window.Wayforpay === "undefined") {
				showCustomErrors([{ message: "WayForPay SDK не завантажено" }]);
				setIsProcessing(false);
				return;
			}

			const wayforpay = new window.Wayforpay();
			const widgetTimeout = setTimeout(() => setIsProcessing(false), 5 * 60 * 1000);
			const cleanup = () => clearTimeout(widgetTimeout);

			wayforpay.run(
				{
					...paymentData,
					straightWidget: true,
					returnUrl: `${window.location.origin}/checkout/order-confirmation?order=${orderId}`,
					serviceUrl: `${process.env.NEXT_PUBLIC_CRM_API_URL || "https://asxcrm.com.ua"}/api/payment/wayforpay/callback`,
					serviceData: orderId,
				},
				// onApproved
				async (_response: WayForPayResponse) => {
					cleanup();
					showSuccess("Оплата успішна!");
					setPendingOrderId(null);
					setOrderNo(null);
					router.push(`/checkout/order-confirmation?order=${orderId}`);
				},
				// onDeclined — також спрацьовує при закритті widget (натиснути X)
				(_response: WayForPayResponse) => {
					cleanup();
					setIsProcessing(false);
					// Замовлення вже створено — показуємо варіанти
					setPendingOrderId(orderId);
					setOrderNo(paymentData.orderNo);
				},
				// onPending
				(_response: WayForPayResponse) => {
					cleanup();
					setIsProcessing(false);
					setPendingOrderId(orderId);
					setOrderNo(paymentData.orderNo);
				},
			);
		},
		[showCustomErrors, showSuccess, router],
	);

	const handlePayment = useCallback(async () => {
		if (!validateCheckout()) return;

		setIsProcessing(true);

		try {
			const responseData = await createWayForPayPayment(checkout.id, pendingOrderId ?? undefined);

			if (!responseData.success || !responseData.data) {
				throw new Error(responseData.error || "Помилка створення платежу");
			}

			const { data: paymentData, orderId } = responseData;
			if (orderId) setPendingOrderId(orderId);

			runWidget(paymentData, orderId!);
		} catch (error) {
			showCustomErrors([
				{ message: error instanceof Error ? error.message : "Помилка оплати. Спробуйте ще раз." },
			]);
			setIsProcessing(false);
		}
	}, [checkout, pendingOrderId, validateCheckout, runWidget, showCustomErrors]);

	// Стан: замовлення створено але не оплачено
	if (pendingOrderId) {
		return (
			<div className="space-y-4">
				<div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
					<p className="font-semibold">Замовлення створено, але не оплачено</p>
					<p className="mt-1 text-xs text-yellow-700">
						Замовлення №{orderNo} збережено. Ви можете оплатити зараз або пізніше.
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						variant="primary"
						onClick={handlePayment}
						disabled={isProcessing}
						label={isProcessing ? "Обробка..." : "Оплатити зараз"}
					/>
					<Button
						variant="secondary"
						onClick={() => router.push(`/checkout/order-confirmation?order=${pendingOrderId}`)}
						label="Оплатити пізніше"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 p-3">
				<svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
					/>
				</svg>
				<span className="text-sm text-neutral-700">Оплата карткою через WayForPay</span>
			</div>
			<Button
				variant="primary"
				onClick={handlePayment}
				disabled={isProcessing}
				label={isProcessing ? "Обробка платежу..." : "Оплатити картою"}
			/>
		</div>
	);
};
