import { useFormContext } from "@/checkout/hooks/useForm/useForm";

export const useField = <TName extends string>(name: TName) => {
	const { handleChange, handleBlur, touched, errors, values } = useFormContext<Record<TName, any>>();
	const isTouched = !!touched[name];
	const error = isTouched ? (errors[name] as string) : undefined;

	return {
		onChange: handleChange,
		handleBlur: handleBlur,
		error,
		isTouched,
		name,
		value: values[name],
	};
};
