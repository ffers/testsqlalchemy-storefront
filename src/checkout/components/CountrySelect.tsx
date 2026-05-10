import React, { useEffect } from "react";
import { Select } from "@/checkout/components/Select";
import { type CountryCode } from "@/checkout/graphql";
import { countries as allCountries } from "@/checkout/lib/consts/countries";
import { getCountryName } from "@/checkout/lib/utils/locale";
import { useFormContext } from "@/checkout/hooks/useForm";

interface CountrySelectProps {
	only?: CountryCode[];
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ only = [] }) => {
	const countriesToMap = only.length ? only : allCountries;
	const { setFieldValue, values } = useFormContext<{ countryCode: string }>();

	const countryOptions = countriesToMap.map((countryCode) => ({
		value: countryCode,
		label: getCountryName(countryCode),
	}));

	const validValues = countryOptions.map((o) => o.value);
	const currentValueIsValid = validValues.includes(values.countryCode as CountryCode);

	useEffect(() => {
		if (countryOptions.length === 1) {
			// Якщо одна країна — автоматично обираємо
			if (values.countryCode !== countryOptions[0]!.value) {
				void setFieldValue("countryCode", countryOptions[0]!.value);
			}
		} else if (!currentValueIsValid) {
			// Якщо кілька країн і поточне значення не в списку — скидаємо щоб показався плейсхолдер
			void setFieldValue("countryCode", "");
		}
	}, [countryOptions.length, currentValueIsValid]); // eslint-disable-line react-hooks/exhaustive-deps

	const hasMultipleCountries = countryOptions.length > 1;
	const placeholder = hasMultipleCountries ? "Оберіть країну" : undefined;

	return (
		<Select
			name="countryCode"
			label="Країна"
			options={countryOptions}
			autoComplete="countryCode"
			placeholder={placeholder}
		/>
	);
};
