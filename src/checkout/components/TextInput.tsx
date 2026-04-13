import { type AllHTMLAttributes } from "react";
import clsx from "clsx";
import { Field, type FieldProps } from "formik";

export interface TextInputProps<TName extends string> extends AllHTMLAttributes<HTMLInputElement> {
	name: TName;
	label: string;
}

export const TextInput = <TName extends string>(props: TextInputProps<TName>) => (
	<Field {...props} component={TextInputComponent} />
);

export const TextInputComponent = <TName extends string>({
	field,
	form: { touched, errors },
	label,
	required,
	...props
}: TextInputProps<TName> & FieldProps) => {
	const isTouched = touched[field.name];
	const error = isTouched ? (errors[field.name] as string) : undefined;
	const hasValue = field.value && String(field.value).trim().length > 0;
	const isValid = isTouched && hasValue && !error;

	return (
		<div className="space-y-0.5">
			<label className="flex flex-col">
				<span className={clsx(
					"text-xs",
					error ? "text-red-600" : isValid ? "text-green-600" : "text-neutral-700"
				)}>
					{label}
					{required && <span aria-hidden="true">*</span>}
					{isValid && <span className="ml-1">✓</span>}
				</span>
				<div className="relative">
					<input
						required={required}
						spellCheck={false}
						{...field}
						{...props}
						className={clsx(
							"mt-0.5 w-full appearance-none rounded-md border-2 shadow-sm transition-colors focus:outline-none focus:ring focus:ring-opacity-50",
							error
								? "border-red-400 focus:border-red-400 focus:ring-red-200"
								: isValid
									? "border-green-400 focus:border-green-400 focus:ring-green-200"
									: "border-neutral-300 focus:border-neutral-400 focus:ring-neutral-200",
							props.className,
						)}
					/>
					{error && (
						<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
							!
						</span>
					)}
				</div>
			</label>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
