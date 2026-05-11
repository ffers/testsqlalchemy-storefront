import Link from "next/link";
import { NavLink } from "./NavLink";
import { executeGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";

const CHANNEL = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "ua";

export const NavLinks = async ({ channel }: { channel: string }) => {
	const slug = `navbar-${CHANNEL}`;
	console.log(`[NavLinks] slug="${slug}" channel="${channel}"`);
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug, channel },
		revalidate: 60 * 60 * 24,
		withAuth: false,
	});
	console.log(`[NavLinks] відповідь:`, JSON.stringify(navLinks));

	return (
		<>
			<NavLink href="/products">Усі товари</NavLink>
			{navLinks.menu?.items?.map((item) => {
				if (item.category) {
					return (
						<NavLink key={item.id} href={`/categories/${item.category.slug}`}>
							{item.category.name}
						</NavLink>
					);
				}
				if (item.collection) {
					return (
						<NavLink key={item.id} href={`/collections/${item.collection.slug}`}>
							{item.collection.name}
						</NavLink>
					);
				}
				if (item.page) {
					return (
						<NavLink key={item.id} href={`/pages/${item.page.slug}`}>
							{item.page.title}
						</NavLink>
					);
				}
				if (item.url) {
					return (
						<Link key={item.id} href={item.url}>
							{item.name}
						</Link>
					);
				}
				return null;
			})}
		</>
	);
};
