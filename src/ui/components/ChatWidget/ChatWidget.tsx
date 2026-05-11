"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChatStore } from "./chatStore";

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

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const CONTACT_TELEGRAM = process.env.NEXT_PUBLIC_CONTACT_TELEGRAM || "";
const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "";
const CONTACT_VIBER = process.env.NEXT_PUBLIC_CONTACT_VIBER || "";
const CONTACT_INSTAGRAM = process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM || "";

export const ChatWidget = () => {
	const { isOpen, open: openChat, close: closeChat } = useChatStore();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sessionToken, setSessionToken] = useState<string | null>(null);
	const [showInitForm, setShowInitForm] = useState(false);
	const [showPhonePopup, setShowPhonePopup] = useState(false);
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

	// Показуємо форму якщо чат відкрито але сесії нема
	useEffect(() => {
		if (isOpen && !sessionToken) {
			setShowInitForm(true);
		}
	}, [isOpen, sessionToken]);

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

	const handleToggle = () => {
		if (isOpen) {
			closeChat();
		} else {
			openChat();
			setHasNewMessage(false);
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
				onClick={handleToggle}
				className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg transition-transform hover:scale-110 hover:bg-neutral-700 ${
					hasNewMessage ? "animate-bounce" : ""
				}`}
				aria-label="Відкрити чат"
			>
				{/* Зелена мігаюча крапка */}
				<span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
					<span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green-500" />
				</span>
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
					<div className="flex flex-col bg-neutral-800 px-4 pt-3 pb-2 text-white">
						{/* Рядок 1: іконка + заголовок + закрити */}
						<div className="flex items-center justify-between">
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
								onClick={() => closeChat()}
								className="rounded-full p-1 transition-colors hover:bg-white/20"
								aria-label="Закрити чат"
							>
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						{/* Рядок 2: контакти */}
						<div className="mt-2 flex items-center gap-1 border-t border-white/10 pt-2">
							{CONTACT_PHONE && (
								<div className="relative">
									<button
										onClick={() => setShowPhonePopup((v) => !v)}
										title="Телефон"
										className="relative rounded-full p-1.5 transition-colors hover:bg-white/20"
									>
										<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
										<span className="absolute right-0.5 top-0.5 flex h-2 w-2">
											<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
											<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
										</span>
									</button>
									{showPhonePopup && (
										<div className="absolute left-0 top-9 z-10 w-48 rounded-xl bg-white p-3 shadow-xl">
											<p className="mb-2 text-xs text-neutral-500">Номер телефону</p>
											<a
												href={`tel:${CONTACT_PHONE}`}
												className="block text-sm font-semibold text-neutral-900 hover:text-neutral-600"
												onClick={() => setShowPhonePopup(false)}
											>
												{CONTACT_PHONE}
											</a>
										</div>
									)}
								</div>
							)}
							{CONTACT_EMAIL && (
								<a href={`mailto:${CONTACT_EMAIL}`} title="Email" className="rounded-full p-1.5 transition-colors hover:bg-white/20">
									<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
								</a>
							)}
							{CONTACT_TELEGRAM && (
								<a href={`https://t.me/${CONTACT_TELEGRAM}`} target="_blank" rel="noopener noreferrer" title="Telegram" className="rounded-full p-1.5 transition-colors hover:bg-white/20">
									<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.947l-2.94-.918c-.638-.203-.651-.638.136-.943l11.492-4.43c.533-.194 1.004.131.946.565z"/></svg>
								</a>
							)}
							{CONTACT_WHATSAPP && (
								<a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="rounded-full p-1.5 transition-colors hover:bg-white/20">
									<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
								</a>
							)}
							{CONTACT_VIBER && (
								<a href={`viber://chat?number=${CONTACT_VIBER}`} title="Viber" className="rounded-full p-1.5 transition-colors hover:bg-white/20">
									<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 0h1.2C18.19.3 23.1 5.6 23.4 11.4v1.2c-.3 5.8-5.21 11.1-11.4 11.4H3L0 21l.6-3C.3 17.4 0 16.2 0 15v-3.6C.3 5.6 5.21.3 11.4 0zM8.4 5.4c-.6 0-1.5.3-1.8.9-.6.9-.6 1.8-.3 2.7.9 2.7 2.4 4.8 4.8 6.6.9.6 1.8 1.2 2.7 1.2.9.3 1.8 0 2.4-.6.3-.3.6-.9.6-1.5 0-.3-.3-.6-.6-.9l-1.8-1.2c-.3-.3-.6-.3-.9 0l-.6.6c-.3.3-.6.3-.9.3-.6-.3-1.5-.9-2.1-1.8-.6-.6-.9-1.5-.9-2.1 0-.3.3-.6.3-.6l.6-.6c.3-.3.3-.6 0-.9L9.3 5.7c-.3-.3-.6-.3-.9-.3z"/></svg>
								</a>
							)}
							{CONTACT_INSTAGRAM && (
								<a href={`https://instagram.com/${CONTACT_INSTAGRAM}`} target="_blank" rel="noopener noreferrer" title="Instagram" className="rounded-full p-1.5 transition-colors hover:bg-white/20">
									<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
								</a>
							)}
						</div>
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
