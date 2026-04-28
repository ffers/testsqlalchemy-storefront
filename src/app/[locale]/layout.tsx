import { type ReactNode } from "react";

const SUPPORTED_LOCALES = ["uk", "en"];

export const generateStaticParams = async () => {
	return SUPPORTED_LOCALES.map((locale) => ({ locale }));
};

export default function LocaleLayout({ children }: { children: ReactNode }) {
	return children;
}
