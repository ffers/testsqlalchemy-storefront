"use client";

import { useState, useCallback } from "react";
import { Button } from "@/checkout/components";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { type WayForPayConfig, type WayForPayResponse, type WayForPayCreateResponse } from "./types";

interface WayForPayComponentProps {
	config: WayForPayConfig;
}

export const WayForPayComponent = ({ config: _config }: WayForPayComponentProps) => {
	const { checkout } = useCheckout();
	const { showCustomErrors, showSuccess } = useAlerts();
	const [isProcessing, setIsProcessing] = useState(false);

	const validateCheckout = useCallback((): boolean => {
		const errors: string[] = [];

		if (!checkout?.email) {
			errors.push("Введіть email");
		}

		if (!checkout?.shippingAddress) {
			errors.push("Введіть адресу доставки");
		} else {
			if (!checkout.shippingAddress.firstName) {
				errors.push("Введіть ім'я");
			}
			if (!checkout.shippingAddress.lastName) {
				errors.push("Введіть прізвище");
			}
			if (!checkout.shippingAddress.phone) {
				errors.push("Введіть номер телефону");
			}
			if (!checkout.shippingAddress.streetAddress1) {
				errors.push("Введіть адресу");
			}
			if (!checkout.shippingAddress.city) {
				errors.push("Введіть місто");
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
	}, [checkout, showCustomErrors]);

	const handlePayment = useCallback(async () => {
		if (!validateCheckout()) {
			return;
		}

		setIsProcessing(true);

		try {
			// Створюємо платіжні дані через API
			const crmApiUrl = process.env.NEXT_PUBLIC_CRM_API_URL || "https://asxcrm.com.ua";
			const response = await fetch(`${crmApiUrl}/api/payment/wayforpay/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					checkoutId: checkout.id,
					email: checkout.email,
					amount: checkout.totalPrice?.gross?.amount,
					currency: checkout.totalPrice?.gross?.currency || "UAH",
					products: checkout.lines?.map((line) => ({
						name: line.variant?.product?.name || "Товар",
						count: line.quantity,
						price: line.totalPrice?.gross?.amount || 0,
					})),
				}),
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || "Помилка створення платежу");
			}

			const responseData = (await response.json()) as WayForPayCreateResponse;

			if (!responseData.success || !responseData.data) {
				throw new Error("Невірна відповідь від сервера");
			}

			const { data: paymentData, orderId } = responseData;

			// Перевіряємо чи завантажений WayForPay SDK
			if (typeof window.Wayforpay === "undefined") {
				throw new Error("WayForPay SDK не завантажено");
			}

			const wayforpay = new window.Wayforpay();

			// Фолбек: якщо WayForPay не викликав жодного callback за 5 хв — розблоковуємо кнопку
			const widgetTimeout = setTimeout(() => setIsProcessing(false), 5 * 60 * 1000);

			const cleanup = () => clearTimeout(widgetTimeout);

			wayforpay.run(
				{
					...paymentData,
					straightWidget: true,
					returnUrl: `${window.location.origin}/checkout/payment/success?checkout=${checkout.id}&order=${paymentData.orderReference}`,
					serviceUrl: `${crmApiUrl}/api/payment/wayforpay/callback`,
					serviceData: orderId, // Saleor orderId для callback
				},
				// onApproved
				async (response: WayForPayResponse) => {
					console.log("Payment approved:", response);
					showSuccess("Оплата успішна!");
					// Checkout вже завершено бекендом при /create (checkoutComplete)
					// Просто редіректимо на success сторінку
					cleanup();
					setIsProcessing(false);
				},
				// onDeclined
				(response: WayForPayResponse) => {
					console.log("Payment declined:", response);
					cleanup();
					showCustomErrors([
						{ message: response.reason || "Оплату відхилено. Спробуйте ще раз." },
					]);
					setIsProcessing(false);
				},
				// onPending
				(response: WayForPayResponse) => {
					console.log("Payment pending:", response);
					cleanup();
					showCustomErrors([{ message: "Очікування підтвердження оплати..." }]);
					setIsProcessing(false);
				},
			);
		} catch (error) {
			console.error("Payment error:", error);
			showCustomErrors([
				{
					message: error instanceof Error ? error.message : "Помилка оплати. Спробуйте ще раз.",
				},
			]);
			setIsProcessing(false);
		}
	}, [checkout, showCustomErrors, showSuccess, validateCheckout]);

	const isLoading = isProcessing;

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 p-3">
				<svg
					className="h-6 w-6 text-green-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
					/>
				</svg>
				<span className="text-sm text-neutral-700">
					Оплата карткою через WayForPay
				</span>
			</div>

			<Button
				variant="primary"
				onClick={handlePayment}
				disabled={isLoading}
				label={isLoading ? "Обробка платежу..." : "Оплатити картою"}
			/>
		</div>
	);
};


