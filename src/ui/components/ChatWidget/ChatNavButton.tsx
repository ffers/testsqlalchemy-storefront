"use client";

import { useChatStore } from "./chatStore";

export const ChatNavButton = () => {
	const { toggle } = useChatStore();

	return (
		<button
			onClick={toggle}
			aria-label="Відкрити чат підтримки"
			className="relative flex items-center justify-center text-neutral-800 transition-colors hover:text-neutral-600"
		>
			<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
				/>
			</svg>
			{/* Зелена крапка — сидить на верхівці трубки */}
			<span className="absolute right-0.5 -top-0.5 flex h-2.5 w-2.5">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
				<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
			</span>
		</button>
	);
};
