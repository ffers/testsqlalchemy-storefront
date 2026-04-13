import { useCallback, useMemo } from "react";
import { type ErrorCode } from "@/checkout/lib/globalTypes";

export const errorMessages = {
	invalid: "Недійсне значення",
	required: "Обов'язкове поле",
	unique: "Значення має бути унікальним",
	emailInvalid: "Електронна адреса має бути дійсною",
	passwordAtLeastCharacters: "Пароль має містити щонайменше 8 символів",
	passwordTooShort: "Наданий пароль занадто короткий. Мінімальна довжина — 8 символів.",
	passwordTooSimilar: "Введений пароль занадто схожий на ваш попередній пароль.",
	passwordTooCommon: "Наданий пароль занадто поширений. Використайте щось складніше.",
	passwordInvalid: "Введений пароль недійсний.",
	quantityGreaterThanLimit: "Обрана кількість перевищує дозволену.",
	insufficientStock: "Недостатньо обраного товару на складі.",
	invalidCredentials: "Під час входу було надано недійсні облікові дані.",
	missingFields: "Відсутні поля у формі адреси: ",
} satisfies Record<ErrorCode, string>;

export type ErrorMessages = Record<ErrorCode, string>;

export const useErrorMessages = <TKey extends string = ErrorCode>(customMessages?: Record<TKey, string>) => {
	const messagesToUse = customMessages || errorMessages;

	const getMessageByErrorCode = useCallback(
		(errorCode: string) => {
			const formattedMessage = messagesToUse[errorCode as keyof typeof messagesToUse];
			if (!formattedMessage) {
				console.warn(`Missing trnalsation: ${errorCode}`);
				return "";
			}
			return formattedMessage;
		},
		[messagesToUse],
	);

	const translatedErrorMessages = useMemo(
		() =>
			Object.keys(messagesToUse).reduce(
				(result, key) => ({
					...result,
					[key]: getMessageByErrorCode(key as TKey),
				}),
				{} as Record<TKey, string>,
			),
		[getMessageByErrorCode, messagesToUse],
	);

	return {
		errorMessages: translatedErrorMessages,
		getMessageByErrorCode,
	};
};
