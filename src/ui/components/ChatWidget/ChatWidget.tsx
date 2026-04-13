"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
	id: string;
	text: string;
	sender: "client" | "manager";
	timestamp: string;
}

interface SessionData {
	session_token: string;
	created_at: string;
}


const API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://asxcrm.com.ua";
const API_KEY = process.env.NEXT_PUBLIC_API_CHAT_KEY || "None2";
const STORAGE_KEY = "chat_session_token";
const USER_DATA_KEY = "chat_user_data";

export const ChatWidget = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sessionToken, setSessionToken] = useState<string | null>(null);
	const [showInitForm, setShowInitForm] = useState(false);
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");
	const [hasNewMessage, setHasNewMessage] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Завантажуємо session token з localStorage
	useEffect(() => {
		const savedToken = localStorage.getItem(STORAGE_KEY);
		const savedUserData = localStorage.getItem(USER_DATA_KEY);

		if (savedToken) {
			setSessionToken(savedToken);
			if (savedUserData) {
				type UserData = {
					name?: string;
					email?: string;
					phone?: string;
				};
				const userData = JSON.parse(savedUserData) as UserData;
				setUserName(userData.name || "");
				setUserEmail(userData.email || "");
				setUserPhone(userData.phone || "");
			}
		}
	}, []);

	// Polling для нових повідомлень
	const pollMessages = useCallback(async () => {
		if (!sessionToken) return;

		try {
			const response = await fetch(`${API_URL}/api/chat/messages/${sessionToken}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": API_KEY,
				},
			});


			if (response.ok) {
				const data = (await response.json()) as { messages: Message[] };
				if (data.messages && data.messages.length > 0) {
					data.messages.forEach((m) => {
						console.log(m.timestamp, new Date(m.timestamp));
					});
					setMessages((prev) => {
						const newMessages = data.messages.filter(
							(msg) => !prev.some((p) => p.id === msg.id)
						);
						if (newMessages.length > 0 && !isOpen) {
							const hasManagerMessage = newMessages.some((m) => m.sender === "manager");
							if (hasManagerMessage) {
								setHasNewMessage(true);
							}
						}
						if (newMessages.length > 0) {
							return [...prev, ...newMessages].sort(
								(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
							);
						}
						return prev;
					});
				}
			}
		} catch (error) {
			console.error("Polling error:", error);
		}
	}, [sessionToken, isOpen]);

	// Запускаємо polling коли є сесія
	useEffect(() => {
		if (sessionToken && isOpen) {
			pollMessages();
			pollingRef.current = setInterval(pollMessages, 3000);
		}

		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
			}
		};
	}, [sessionToken, isOpen, pollMessages]);

	const createSession = async () => {
		if (!userName.trim() || !userEmail.trim()) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${API_URL}/api/chat/session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": API_KEY,
				},
				body: JSON.stringify({
					name: userName,
					email: userEmail,
					phone: userPhone,
				}),
			});

			if (response.ok) {
				const data = (await response.json()) as SessionData;
				setSessionToken(data.session_token);
				localStorage.setItem(STORAGE_KEY, data.session_token);
				localStorage.setItem(
					USER_DATA_KEY,
					JSON.stringify({ name: userName, email: userEmail, phone: userPhone })
				);
				setShowInitForm(false);
				setMessages([
					{
						id: "welcome",
						text: `Вітаємо, ${userName}! Чим можемо допомогти?`,
						sender: "manager",
						timestamp: new Date().toISOString(),
					},
				]);
			} else {
				console.error("Failed to create session");
			}
		} catch (error) {
			console.error("Create session error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const sendMessage = async () => {
		if (!inputValue.trim() || !sessionToken) return;

		const messageText = inputValue.trim();
		setInputValue("");

		// Оптимістично додаємо повідомлення
		const tempMessage: Message = {
			id: `temp-${Date.now()}`,
			text: messageText,
			sender: "client",
			timestamp: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, tempMessage]);

		try {
			const response = await fetch(`${API_URL}/api/chat/send`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": API_KEY,
				},
				body: JSON.stringify({
					session_token: sessionToken,
					message: messageText,
				}),
			});

			if (!response.ok) {
				console.error("Failed to send message");
			}
		} catch (error) {
			console.error("Send message error:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleOpen = () => {
		setIsOpen(true);
		setHasNewMessage(false);
		if (!sessionToken) {
			setShowInitForm(true);
		}
	};

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<>
			{/* Floating Button */}
			<button
				onClick={handleOpen}
				className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg transition-transform hover:scale-110 hover:bg-neutral-700 ${
					hasNewMessage ? "animate-bounce" : ""
				}`}
				aria-label="Відкрити чат"
			>
				{hasNewMessage && (
					<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs">
						!
					</span>
				)}
				<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					/>
				</svg>
			</button>

			{/* Chat Modal */}
			{isOpen && (
				<div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:h-[550px] sm:w-[400px]">
					{/* Header */}
					<div className="flex items-center justify-between bg-neutral-800 px-4 py-3 text-white">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>
							<div>
								<p className="font-medium">Підтримка</p>
								<p className="text-xs text-white/70">Зазвичай відповідаємо протягом 5 хв</p>
							</div>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="rounded-full p-1 transition-colors hover:bg-white/20"
							aria-label="Закрити чат"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Init Form */}
					{showInitForm ? (
						<div className="flex flex-1 flex-col justify-center p-6">
							<h3 className="mb-4 text-center text-lg font-medium text-neutral-900">
								Почати розмову
							</h3>
							<p className="mb-6 text-center text-sm text-neutral-600">
								Введіть ваші дані, щоб ми могли вам допомогти
							</p>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="Ваше ім'я *"
									value={userName}
									onChange={(e) => setUserName(e.target.value)}
									className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
								<input
									type="email"
									placeholder="Email *"
									value={userEmail}
									onChange={(e) => setUserEmail(e.target.value)}
									className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
								<input
									type="tel"
									placeholder="Телефон (необов'язково)"
									value={userPhone}
									onChange={(e) => setUserPhone(e.target.value)}
									className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
								/>
								<button
									onClick={createSession}
									disabled={isLoading || !userName.trim() || !userEmail.trim()}
									className="w-full rounded-lg bg-neutral-800 py-2 font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isLoading ? "Завантаження..." : "Почати чат"}
								</button>
							</div>
						</div>
					) : (
						<>
							{/* Messages */}
							<div className="flex-1 overflow-y-auto p-4">
								{messages.length === 0 ? (
									<div className="flex h-full items-center justify-center text-neutral-500">
										<p>Напишіть нам повідомлення</p>
									</div>
								) : (
									<div className="space-y-3">
										{messages.map((message) => (
											<div
												key={message.id}
												className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
											>
												<div
													className={`max-w-[80%] rounded-2xl px-4 py-2 ${
														message.sender === "client"
															? "rounded-br-md bg-neutral-800 text-white"
															: "rounded-bl-md bg-neutral-100 text-neutral-900"
													}`}
												>
													<p className="text-sm">{message.text}</p>
													<p
														className={`mt-1 text-xs ${
															message.sender === "client" ? "text-white/60" : "text-neutral-500"
														}`}
													>
														{formatTime(message.timestamp)}
													</p>
												</div>
											</div>
										))}
										<div ref={messagesEndRef} />
									</div>
								)}
							</div>

							{/* Input */}
							<div className="border-t border-neutral-200 p-4">
								<div className="flex gap-2">
									<input
										type="text"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder="Напишіть повідомлення..."
										className="flex-1 rounded-full border border-neutral-300 px-4 py-2 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
									/>
									<button
										onClick={sendMessage}
										disabled={!inputValue.trim()}
										className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
										aria-label="Відправити"
									>
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
											/>
										</svg>
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};
