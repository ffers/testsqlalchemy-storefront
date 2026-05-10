import Link from "next/link";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function Footer({ channel }: { channel: string }) {
	const slug = `footer-${channel}`;
	console.log(`[Footer] slug="${slug}" channel="${channel}"`);
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug, channel },
		cache: "no-store",
		withAuth: false,
	});
	console.log(`[Footer] відповідь:`, JSON.stringify(footerLinks, null, 2));

	const channels = process.env.SALEOR_APP_TOKEN
		? await executeGraphQL(ChannelsListDocument, {
				withAuth: false,
				headers: {
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
			})
		: null;
	const currentYear = new Date().getFullYear();
	const public_name = process.env.NEXT_PUBLIC_NAME ?? "DEFAULT";

	const renderLink = (node: { page?: { slug: string; title: string } | null; category?: { slug: string; name: string } | null; collection?: { slug: string; name: string } | null; url?: string | null; name: string }) => {
		if (node.page) return <LinkWithChannel href={`/pages/${node.page.slug}`}>{node.page.title}</LinkWithChannel>;
		if (node.category) return <LinkWithChannel href={`/categories/${node.category.slug}`}>{node.category.name}</LinkWithChannel>;
		if (node.collection) return <LinkWithChannel href={`/collections/${node.collection.slug}`}>{node.collection.name}</LinkWithChannel>;
		if (node.url) return <LinkWithChannel href={node.url}>{node.name}</LinkWithChannel>;
		return null;
	};

	return (
		<footer className="border-neutral-300 bg-neutral-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="grid grid-cols-3 gap-8 py-16">
					{footerLinks.menu?.items?.map((item) => {
						const hasChildren = item.children && item.children.length > 0;
						const topLink = renderLink(item);

						if (hasChildren) {
							// Дворівнева структура: секція з дочірніми посиланнями
							return (
								<div key={item.id}>
									<h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
									<ul className="mt-4 space-y-4 [&>li]:text-neutral-500">
										{item.children?.map((child) => (
											<li key={child.id} className="text-sm">
												{renderLink(child)}
											</li>
										))}
									</ul>
								</div>
							);
						}

						// Однорівнева структура: пункт сам є посиланням
						if (topLink) {
							return (
								<div key={item.id} className="text-sm text-neutral-500">
									{topLink}
								</div>
							);
						}

						// Просто текст без посилання
						return (
							<div key={item.id}>
								<h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
							</div>
						);
					})}
				</div>

				{channels?.channels && (
					<div className="mb-4 text-neutral-500">
						<label>
							<span className="text-sm">Change currency:</span> <ChannelSelect channels={channels.channels} />
						</label>
					</div>
				)}

				<div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
					<p className="text-sm text-neutral-500">Copyright &copy; {currentYear} {public_name}, Inc.</p>
					<p className="flex gap-1 text-sm text-neutral-500">
						Powered by{" "}
						<Link target={"_blank"} href={"https://asxcrm.com.ua/"}>
							ASXCRM
						</Link>{" "}
						<Link href={"https://github.com/fferses"} target={"_blank"} className={"opacity-30"}>
							<Image alt="Saleor github repository" height={20} width={20} src={"/github-mark.svg"} />
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
