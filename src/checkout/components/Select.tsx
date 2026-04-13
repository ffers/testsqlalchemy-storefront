import { type SelectHTMLAttributes, type ChangeEvent, type ReactNode, useState } from "react";
import clsx from "clsx";
import { useField } from "@/checkout/hooks/useForm/useField";

export interface Option<TData extends string = string> {
	label: ReactNode;
	value: TData;
	disabled?: boolean;
	icon?: ReactNode;
	[key: string]: unknown;
}

interface SelectProps<TName extends string, TData extends string>
	extends SelectHTMLAttributes<HTMLSelectElement> {
	name: TName;
	placeholder?: TName;
	label?: ReactNode;
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
	options: Option<TData>[];
}

export const Select = <TName extends string, TData extends string>({
	name,
	placeholder,
	onChange,
	options,
	label,
	...rest
}: SelectProps<TName, TData>) => {
	const { error, handleBlur, isTouched, ...fieldProps } = useField(name);

	const [showPlaceholder, setShowPlaceholder] = useState(!!placeholder);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		if (!event.currentTarget.value) {
			return;
		}

		setShowPlaceholder(false);
		onChange?.(event);
		fieldProps.onChange(event);
	};

	const hasValue = fieldProps.value && String(fieldProps.value).trim().length > 0;
	const isValid = isTouched && hasValue && !error;

	return (
		<div className="space-y-0.5">
			<label className="flex flex-col">
				<span className={clsx(
					"text-xs",
					error ? "text-red-600" : isValid ? "text-green-600" : "text-neutral-700"
				)}>
					{label}
					{isValid && <span className="ml-1">✓</span>}
				</span>
				<select
					{...fieldProps}
					{...rest}
					onBlur={handleBlur}
					onChange={handleChange}
					className={clsx(
						"mt-1 block w-full rounded-md border-2 shadow-sm transition-colors focus:outline-none focus:ring focus:ring-opacity-50",
						error
							? "border-red-400 focus:border-red-400 focus:ring-red-200"
							: isValid
								? "border-green-400 focus:border-green-400 focus:ring-green-200"
								: "border-neutral-300 focus:border-neutral-400 focus:ring-neutral-200"
					)}
				>
					{showPlaceholder && (
						<option disabled value="">
							{placeholder}
						</option>
					)}
					{options.map(({ label, value, disabled = false }) => (
						<option value={value} disabled={disabled} key={label?.toString() + "_" + value}>
							{label}
						</option>
					))}
				</select>
			</label>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
