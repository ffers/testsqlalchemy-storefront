import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { CookieConsentBanner } from "@/ui/components/CookieConsentBanner";
import { ChatWidget } from "@/ui/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });
const NEXT_PUBLIC_NAME = process.env.NEXT_PUBLIC_NAME ?? "DEFAULT"
export const metadata: Metadata = {
	title: `${process.env.NEXT_PUBLIC_NAME}`,
	description: `${NEXT_PUBLIC_NAME} це магазин tie-dye шкарпеток та одягу `,
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="en" className="min-h-dvh">
			<body className={`${inter.className} min-h-dvh`}>
				{children}
				<Suspense>
					<DraftModeNotification />
				</Suspense>
				<CookieConsentBanner />
				<ChatWidget />
			</body>
		</html>
	);
}
