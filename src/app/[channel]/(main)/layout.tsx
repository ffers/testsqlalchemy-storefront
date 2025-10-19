import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { Footer } from "@/ui/components/Footer";
import { Header } from "@/ui/components/Header";

export const metadata = {
  title: "Jemis W - Socks & Wear.",
  description:
    "Starter pack for building performant e-commerce experiences with Saleor.",
};

// список дозволених каналів
const KNOWN_CHANNELS = ["ua", "default-channel", "rams"];
const DEFAULT_CHANNEL = "ua";

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ channel: string }>;
}) {
  const channel = (await props.params).channel;

  // ✅ перевіряємо валідність каналу
  if (!KNOWN_CHANNELS.includes(channel)) {
    redirect(`/${DEFAULT_CHANNEL}`);
  }

  return (
    <>
      <Header channel={channel} />
      <div className="flex min-h-[calc(100dvh-64px)] flex-col">
        <main className="flex-1">{props.children}</main>
        <Footer channel={channel} />
      </div>
    </>
  );
}