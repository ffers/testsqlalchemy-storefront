import { type FallbackProps } from "react-error-boundary";
import { Button } from "@/checkout/components/Button";
import { ErrorContentWrapper } from "@/checkout/components/ErrorContentWrapper";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	console.error(error);

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<ErrorContentWrapper>
			<div className="mb-4 text-8xl">🐊</div>
			<p>Не вдалося завантажити інформацію про ваше замовлення. Поверніться до магазину та спробуйте ще раз.</p>
			<Button ariaLabel="Повернутись до магазину" onClick={goBack} variant="secondary" label="Повернутись до магазину" />
		</ErrorContentWrapper>
	);
};
