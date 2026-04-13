import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

export const PaymentMethods = () => {
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	if (changingBillingCountry || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	return <PaymentMethodSelector />;
};
