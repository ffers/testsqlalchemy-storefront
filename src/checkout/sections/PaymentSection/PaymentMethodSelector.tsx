"use client";

import { useState } from "react";
import { DummyComponent } from "./DummyDropIn/dummyComponent";
import { WayForPayComponent } from "./WayForPay/WayForPayComponent";

type PaymentMethodType = "cod" | "wayforpay";

interface PaymentOption {
	id: PaymentMethodType;
	label: string;
	description: string;
	icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
	{
		id: "cod",
		label: "Оплата при отриманні",
		description: "Оплатіть готівкою або карткою при доставці",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
	},
	{
		id: "wayforpay",
		label: "Оплата карткою онлайн",
		description: "Visa, Mastercard через WayForPay",
		icon: (
			<svg
				className="h-6 w-6"
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
		),
	},
];

export const PaymentMethodSelector = () => {
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("cod");

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				{paymentOptions.map((option) => (
					<label
						key={option.id}
						className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
							selectedMethod === option.id
								? "border-neutral-800 bg-neutral-50"
								: "border-neutral-200 hover:border-neutral-300"
						}`}
					>
						<input
							type="radio"
							name="paymentMethod"
							value={option.id}
							checked={selectedMethod === option.id}
							onChange={() => setSelectedMethod(option.id)}
							className="mt-1 h-4 w-4 accent-neutral-800"
						/>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="text-neutral-600">{option.icon}</span>
								<span className="font-medium text-neutral-900">{option.label}</span>
							</div>
							<p className="mt-1 text-sm text-neutral-500">{option.description}</p>
						</div>
					</label>
				))}
			</div>

			<div className="pt-2">
				{selectedMethod === "cod" && <DummyComponent />}
				{selectedMethod === "wayforpay" && (
					<WayForPayComponent config={{ id: "app.saleor.wayforpay", name: "WayForPay", data: {} }} />
				)}
			</div>
		</div>
	);
};
