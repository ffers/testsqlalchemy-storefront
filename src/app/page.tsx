import { redirect } from "next/navigation";

export default function EmptyPage() {
	redirect(`/${process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "uk"}`);
}
