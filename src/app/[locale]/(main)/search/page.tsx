import { notFound, redirect } from "next/navigation";
import { OrderDirection, ProductOrderField, SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";

const CHANNEL = process.env.NEXT_PUBLIC_SALEOR_CHANNEL_SLUG || "ua";

export const metadata = {
	title: "Пошук товарів· Open Wear",
	description: "Пошук товарів на Open Wear",
};

export default async function Page(props: {
	searchParams: Promise<Record<"query" | "cursor", string | string[] | undefined>>;
	params: Promise<{ locale: string }>;
}) {
	const [searchParams] = await Promise.all([props.searchParams]);
	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const searchValue = searchParams.query;

	if (!searchValue) {
		notFound();
	}

	if (Array.isArray(searchValue)) {
		const firstValidSearchValue = searchValue.find((v) => v.length > 0);
		if (!firstValidSearchValue) {
			notFound();
		}
		redirect(`/search?${new URLSearchParams({ query: firstValidSearchValue }).toString()}`);
	}

	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables: {
			first: ProductsPerPage,
			search: searchValue,
			after: cursor,
			sortBy: ProductOrderField.Rating,
			sortDirection: OrderDirection.Asc,
			channel: CHANNEL,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const newSearchParams = new URLSearchParams({
		query: searchValue,
		...(products.pageInfo.endCursor && { cursor: products.pageInfo.endCursor }),
	});

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			{products.totalCount && products.totalCount > 0 ? (
				<div>
					<h1 className="pb-8 text-xl font-semibold">Search results for &quot;{searchValue}&quot;:</h1>
					<ProductList products={products.edges.map((e) => e.node)} />
					<Pagination
						pageInfo={{
							...products.pageInfo,
							basePathname: `/search`,
							urlSearchParams: newSearchParams,
						}}
					/>
				</div>
			) : (
				<h1 className="mx-auto pb-8 text-center text-xl font-semibold">Нічого не знайдено :(</h1>
			)}
		</section>
	);
}
