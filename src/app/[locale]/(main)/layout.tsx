import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { Footer } from "@/ui/components/Footer";
import { Header } from "@/ui/components/Header";

const NEXT_PUBLIC_NAME = process.env.NEXT_PUBLIC_NAME ?? "DEFAULT";
const SUPPORTED_LOCALES = ["uk", "en"];
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "uk";
const CHANNEL = process.env.NEXT_PUBLIC_SALEOR_CHANNEL_SLUG || "ua";

export const metadata = {
  title: `${NEXT_PUBLIC_NAME} · Socks & Wear.`,
  description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  return (
    <>
      <Header channel={CHANNEL} />
      <div className="flex min-h-[calc(100dvh-64px)] flex-col">
        <main className="flex-1">{props.children}</main>
        <Footer channel={CHANNEL} />
      </div>
    </>
  );
}
