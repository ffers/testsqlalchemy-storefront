import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { HeroBanner, type BannerSlide } from "@/ui/components/HeroBanner";

const CHANNEL = process.env.NEXT_PUBLIC_SALEOR_CHANNEL_SLUG || "ua";
const NEXT_PUBLIC_NAME = process.env.NEXT_PUBLIC_NAME ?? "DEFAULT"

export const metadata = {
	title: `${NEXT_PUBLIC_NAME}· Socks & Wear.`,
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

const bannerSlides: BannerSlide[] = [
	{
		id: "1",
		// image: "/banner-1.jpg", // Додайте зображення в public/
		title: "Нова колекція",
		subtitle: "Унікальні tie-dye шкарпетки ручної роботи",
		buttonText: "Переглянути",
		buttonLink: "/default-channel/products",
		textPosition: "left",
		bgColor: "#4a5568",
	},
	{
		id: "2",
		// image: "/banner-2.jpg",
		title: "Безкоштовна доставка",
		subtitle: "При замовленні від 500 грн",
		buttonText: "Замовити",
		buttonLink: "/default-channel/products",
		textPosition: "center",
		bgColor: "#2d3748",
	},
	{
		id: "3",
		// image: "/banner-3.jpg",
		title: "Знижки до -30%",
		subtitle: "На весь асортимент",
		buttonText: "Дивитись",
		buttonLink: "/default-channel/collections/sale",
		textPosition: "right",
		bgColor: "#1a202c",
	},
];

export default async function Page(props: { params: Promise<{ locale: string }> }) {
	const params = await props.params;
	console.log(`[MainPage] locale=${params.locale} channel=${CHANNEL}`);
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel: CHANNEL,
		},
		revalidate: 60,
		withAuth: false,
	});

	const products = data.collection?.products?.edges.map(({ node: product }) => product) || [];

	return (
		<>
			<HeroBanner slides={bannerSlides} autoPlayInterval={5000} />

			<section className="mx-auto max-w-7xl p-8 pb-16">
				<h2 className="mb-8 text-2xl font-bold text-neutral-900">Популярні товари</h2>
				{products.length > 0 ? (
					<ProductList products={products} />
				) : (
					<p className="text-neutral-600">Товари скоро з&apos;являться</p>
				)}
			</section>
		</>
	);
}
