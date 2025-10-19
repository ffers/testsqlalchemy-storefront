/** @type {import('next').NextConfig} */
const config = {
    eslint: {
        ignoreDuringBuilds: true, // ⛔ Next.js перестане лінтити під час dev і build
    },
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "jemis.com.ua",
			},
			{
				protocol: "https",
				hostname: "www.jemis.com.ua",
			},
		],
	},
	experimental: {
		typedRoutes: false,
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
};

export default config;
