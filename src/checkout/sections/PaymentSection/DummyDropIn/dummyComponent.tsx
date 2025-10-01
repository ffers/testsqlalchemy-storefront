// "use client";

// import { dummyGatewayId } from "./types";
// import { Button } from "@/checkout/components";
// import { useTransactionInitializeMutation } from "@/checkout/graphql";
// import { useAlerts } from "@/checkout/hooks/useAlerts";
// import { useCheckout } from "@/checkout/hooks/useCheckout";
// import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";

// Basic implementation of the test gateway:
// https://github.com/saleor/dummy-payment-app/

// export const DummyComponent = () => {
// 	const { showCustomErrors } = useAlerts();

// 	const { checkout } = useCheckout();
// 	const [transactionInitializeState, transactionInitialize] = useTransactionInitializeMutation();
// 	const {onCheckoutComplete, completingCheckout} = useCheckoutComplete()
// 	const isInProgress = completingCheckout || transactionInitializeState.fetching;

// 	const onInitalizeClick = () => {
// 		void transactionInitialize({
// 			checkoutId: checkout.id,
// 			paymentGateway: {
// 				id: dummyGatewayId,
// 				data: {
// 					"event": {
// 						"includePspReference": true,
// 						"type": "CHARGE_SUCCESS"
// 					}
// 				},
// 			},
// 		}).catch((err) => {
// 			console.error("There was a problem with Dummy Payment Gateway:", err);
// 		}).then((_) => {
// 			return onCheckoutComplete()
// 		}).then((res) => {
// 			if(res?.apiErrors){
// 				res.apiErrors.forEach((error) => {
// 					showCustomErrors([{ message: error.message }]);
// 				});
// 			}
// 		})
// 	}

// 	if(isInProgress){
// 		return <Button variant="primary" disabled={true} label="Processing payment..."/>
// 	}

// 	return (
// 		<Button variant="primary" onClick={onInitalizeClick} label="Make payment and create order"/>
// 	);
// };

"use client";

import { Button } from "@/checkout/components";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useAlerts } from "@/checkout/hooks/useAlerts";


export const DummyComponent = () => {
	const { checkout } = useCheckout();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();
    const { showCustomErrors } = useAlerts();   
	// 👇 тут дивишся, що реально є у checkout
	console.log("Checkout data:", checkout);

	const handleClick = () => {
        if (!checkout?.email) {
        showCustomErrors([{ message: "Введіть email для оформлення замовлення" }]);
        }
        if (!checkout?.email) {
        return null;
    }
		console.log("Completing checkout with id:", checkout?.id);
		void onCheckoutComplete();
	};

	if (completingCheckout) {
		return <Button variant="primary" disabled label="Завершуємо замовлення..." />;
	}

	return <Button variant="primary" onClick={handleClick} label="Оплата при отриманні — підтвердити" />;
};
