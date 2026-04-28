import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-8 text-center">
			<div className="text-9xl">🐊</div>
			<h1 className="text-6xl font-bold text-neutral-900">404</h1>
			<p className="text-xl text-neutral-600">Товар не знайдено</p>
			<Link
				href="/uk/products"
				className="mt-2 rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 transition-colors"
			>
				Повернутись до товарів
			</Link>
		</div>
	);
}
