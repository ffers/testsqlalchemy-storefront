"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ComponentProps } from "react";

export const LinkWithChannel = ({
	href,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) => {
	const { locale } = useParams<{ locale?: string }>();

	if (!href.startsWith("/")) {
		return <Link {...props} href={href} />;
	}

	const encodedLocale = encodeURIComponent(locale ?? "");
	const hrefWithLocale = `/${encodedLocale}${href}`;
	return <Link {...props} href={hrefWithLocale} />;
};
