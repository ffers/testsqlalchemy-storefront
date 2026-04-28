export const wayforpayGatewayId = "app.saleor.wayforpay";
export type WayForPayGatewayId = typeof wayforpayGatewayId;

export interface WayForPayConfig {
	id: WayForPayGatewayId;
	name: string;
	data: Record<string, unknown>;
}

export interface WayForPayPaymentData {
	merchantAccount: string;
	merchantDomainName: string;
	orderReference: string;
	orderNo: string;
	orderDate: number;
	amount: number;
	currency: string;
	productName: string[];
	productCount: number[];
	productPrice: number[];
	merchantSignature: string;
	clientEmail?: string;
}

export interface WayForPayCreateResponse {
	success: boolean;
	data?: WayForPayPaymentData;
	orderId?: string;
	error?: string;
}

declare global {
	interface Window {
		Wayforpay: new () => {
			run: (
				params: WayForPayPaymentData & {
					straightWidget?: boolean;
					returnUrl?: string;
					serviceUrl?: string;
					serviceData?: string;
				},
				onApproved?: (response: WayForPayResponse) => void,
				onDeclined?: (response: WayForPayResponse) => void,
				onPending?: (response: WayForPayResponse) => void,
			) => void;
		};
	}
}

export interface WayForPayResponse {
	orderReference: string;
	transactionStatus: "Approved" | "Declined" | "Pending" | "Expired" | "Refunded";
	reasonCode?: number;
	reason?: string;
	authCode?: string;
	cardPan?: string;
	recToken?: string;
}
