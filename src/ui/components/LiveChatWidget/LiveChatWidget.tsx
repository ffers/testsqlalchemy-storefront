"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
	ChatContainer,
	ConversationHeader,
	MainContainer,
	Message,
	MessageInput,
	MessageList,
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useRef, useState } from "react";
import { useCrmChat } from "@/lib/crm-chat";
import type { ChatUser } from "@/lib/crm-chat";

interface LiveChatWidgetProps {
	user?: ChatUser | null;
}

export function LiveChatWidget({ user }: LiveChatWidgetProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const messageListRef = useRef<HTMLDivElement>(null);

	const { messages, connectionStatus, isTyping, sendMessage, sendTyping, connect, disconnect } =
		useCrmChat({
			lazyInit: true, // Only connect when chat is opened
			user,
		});

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messageListRef.current) {
			messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
		}
	}, [messages]);

	// Connect when chat is opened
	useEffect(() => {
		if (isOpen && connectionStatus === "disconnected") {
			connect();
		}
	}, [isOpen, connectionStatus, connect]);

	const handleSend = (text: string) => {
		if (!text.trim()) return;

		sendMessage(text.trim());
		setInputValue("");
		sendTyping(false);
	};

	const handleInputChange = (value: string) => {
		setInputValue(value);

		// Send typing indicator
		if (value.length > 0) {
			sendTyping(true);
		} else {
			sendTyping(false);
		}
	};

	const toggleChat = () => {
		setIsOpen((prev) => !prev);
	};

	const handleClose = () => {
		setIsOpen(false);
		disconnect();
	};

	// Connection status badge
	const getStatusBadge = () => {
		switch (connectionStatus) {
			case "connecting":
				return (
					<div className="flex items-center gap-1 text-xs text-yellow-600">
						<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
						Підключення...
					</div>
				);
			case "connected":
				return (
					<div className="flex items-center gap-1 text-xs text-green-600">
						<span className="inline-block h-2 w-2 rounded-full bg-green-500" />
						Онлайн
					</div>
				);
			case "error":
			case "disconnected":
				return (
					<div className="flex items-center gap-1 text-xs text-red-600">
						<span className="inline-block h-2 w-2 rounded-full bg-red-500" />
						Відключено
					</div>
				);
		}
	};

	return (
		<>
			{/* Chat Window */}
			{isOpen && (
				<div className="fixed bottom-20 right-4 z-50 h-[500px] w-[380px] overflow-hidden rounded-lg shadow-2xl md:bottom-24 md:right-6">
					<MainContainer className="h-full">
						<ChatContainer>
							{/* Header */}
							<ConversationHeader>
								<ConversationHeader.Content
									userName="Jemis W Support"
									info={getStatusBadge()}
								/>
								<ConversationHeader.Actions>
									<button
										onClick={handleClose}
										className="text-gray-500 transition-colors hover:text-gray-700"
										aria-label="Закрити чат"
									>
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</ConversationHeader.Actions>
							</ConversationHeader>

							{/* Message List */}
							<MessageList
								typingIndicator={
									isTyping ? <TypingIndicator content="Менеджер друкує" /> : null
								}
							>
								{messages.length === 0 && connectionStatus === "connected" && (
									<div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500">
										<div>
											<p className="mb-2 font-medium">Вітаємо в Jemis W Support! 👋</p>
											<p>Напишіть нам повідомлення, і ми відповімо якомога швидше.</p>
										</div>
									</div>
								)}

								{messages.map((msg) => (
									<Message
										key={msg.id}
										model={{
											message: msg.text,
											sentTime: msg.timestamp,
											sender: msg.senderName || msg.sender || "You",
											direction: msg.direction,
											position: "single",
										}}
									/>
								))}
							</MessageList>

							{/* Input */}
							<MessageInput
								placeholder="Напишіть повідомлення..."
								value={inputValue}
								onChange={handleInputChange}
								onSend={handleSend}
								disabled={connectionStatus !== "connected"}
								attachButton={false}
							/>
						</ChatContainer>
					</MainContainer>
				</div>
			)}

			{/* Floating Bubble Button */}
			{!isOpen && (
				<button
					onClick={toggleChat}
					className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 md:bottom-8 md:right-6 md:h-16 md:w-16"
					aria-label="Відкрити чат"
				>
					{/* Chat Icon SVG */}
					<svg
						className="h-7 w-7 md:h-8 md:w-8"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						/>
					</svg>

					{/* Notification Badge (optional - показує к-ть непрочитаних) */}
					{messages.filter((m) => m.direction === "incoming").length > 0 && (
						<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
							{messages.filter((m) => m.direction === "incoming").length}
						</span>
					)}
				</button>
			)}
		</>
	);
}
