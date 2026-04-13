import { type ReactNode } from "react";
import Script from "next/script";
import { AuthProvider } from "@/ui/components/AuthProvider";
const NEXT_PUBLIC_NAME = process.env.NEXT_PUBLIC_NAME ?? "DEFAULT"
export const metadata = {
	title: `${NEXT_PUBLIC_NAME}· Socks & Wear.`,
	description: "Starter pack for building performant e-commerce experiences.",
};

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<main>
			<Script
				src="https://secure.wayforpay.com/server/pay-widget.js"
				strategy="beforeInteractive"
			/>
			<AuthProvider>{props.children}</AuthProvider>
		</main>
	);
}
