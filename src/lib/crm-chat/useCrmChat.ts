"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getChatSessionId } from "./session";
import type {
	ChatMessage,
	ChatUser,
	ConnectionStatus,
	SendMessagePayload,
	SendTypingPayload,
	WebSocketMessage,
} from "./types";

interface UseCrmChatOptions {
	/**
	 * Lazy initialization - only connect when explicitly requested
	 * Default: true
	 */
	lazyInit?: boolean;
	/**
	 * Auto-reconnect on disconnect
	 * Default: true
	 */
	autoReconnect?: boolean;
	/**
	 * Reconnect delay in ms
	 * Default: 3000
	 */
	reconnectDelay?: number;
	/**
	 * Current Saleor user (if authenticated)
	 */
	user?: ChatUser | null;
}

interface UseCrmChatReturn {
	messages: ChatMessage[];
	connectionStatus: ConnectionStatus;
	isTyping: boolean;
	sendMessage: (text: string) => void;
	sendTyping: (isTyping: boolean) => void;
	connect: () => void;
	disconnect: () => void;
	clearMessages: () => void;
}

export function useCrmChat(options: UseCrmChatOptions = {}): UseCrmChatReturn {
	const {
		lazyInit = true,
		autoReconnect = true,
		reconnectDelay = 3000,
		user = null,
	} = options;

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
	const [isTyping, setIsTyping] = useState(false);

	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const shouldReconnectRef = useRef(autoReconnect);

	/**
	 * Build WebSocket URL with session and user info
	 */
	const buildWsUrl = useCallback((): string => {
		const wsBaseUrl = process.env.NEXT_PUBLIC_CRM_WS_URL;
		if (!wsBaseUrl) {
			console.error("NEXT_PUBLIC_CRM_WS_URL is not defined");
			return "";
		}

		const sessionId = getChatSessionId();
		let url = `${wsBaseUrl}/${sessionId}`;

		// Add user_id if authenticated
		if (user?.id) {
			url += `?user_id=${user.id}`;
			if (user.email) {
				url += `&email=${encodeURIComponent(user.email)}`;
			}
		}

		return url;
	}, [user]);

	/**
	 * Handle incoming WebSocket messages
	 */
	const handleMessage = useCallback((event: MessageEvent) => {
		try {
			const data: WebSocketMessage = JSON.parse(event.data);

			switch (data.type) {
				case "message":
					if (data.text) {
						const newMessage: ChatMessage = {
							id: `${Date.now()}-${Math.random()}`,
							text: data.text,
							direction: "incoming",
							timestamp: new Date().toISOString(),
							sender: "manager",
							senderName: "Менеджер",
						};
						setMessages((prev) => [...prev, newMessage]);
					}
					break;

				case "typing":
					setIsTyping(data.isTyping || false);
					break;

				case "history":
					if (data.messages && Array.isArray(data.messages)) {
						setMessages(data.messages);
					}
					break;

				case "connected":
					console.log("✅ Connected to CRM chat");
					break;

				case "error":
					console.error("❌ CRM chat error:", data.error);
					break;

				default:
					console.warn("Unknown message type:", data);
			}
		} catch (error) {
			console.error("Failed to parse WebSocket message:", error);
		}
	}, []);

	/**
	 * Connect to WebSocket
	 */
	const connect = useCallback(() => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			console.log("Already connected");
			return;
		}

		const url = buildWsUrl();
		if (!url) {
			setConnectionStatus("error");
			return;
		}

		try {
			setConnectionStatus("connecting");
			const ws = new WebSocket(url);

			ws.onopen = () => {
				console.log("🔌 WebSocket connected");
				setConnectionStatus("connected");
				shouldReconnectRef.current = autoReconnect;

				// Request chat history
				ws.send(JSON.stringify({ type: "get_history" }));
			};

			ws.onmessage = handleMessage;

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
				setConnectionStatus("error");
			};

			ws.onclose = (event) => {
				console.log("WebSocket closed:", event.code, event.reason);
				setConnectionStatus("disconnected");
				wsRef.current = null;

				// Auto-reconnect
				if (shouldReconnectRef.current && autoReconnect) {
					console.log(`Reconnecting in ${reconnectDelay}ms...`);
					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, reconnectDelay);
				}
			};

			wsRef.current = ws;
		} catch (error) {
			console.error("Failed to connect:", error);
			setConnectionStatus("error");
		}
	}, [buildWsUrl, autoReconnect, reconnectDelay, handleMessage]);

	/**
	 * Disconnect from WebSocket
	 */
	const disconnect = useCallback(() => {
		shouldReconnectRef.current = false;

		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
		}

		setConnectionStatus("disconnected");
	}, []);

	/**
	 * Send a text message
	 */
	const sendMessage = useCallback((text: string) => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			console.error("WebSocket is not connected");
			return;
		}

		const payload: SendMessagePayload = {
			type: "message",
			text,
		};

		wsRef.current.send(JSON.stringify(payload));

		// Add to local messages immediately
		const newMessage: ChatMessage = {
			id: `${Date.now()}-${Math.random()}`,
			text,
			direction: "outgoing",
			timestamp: new Date().toISOString(),
		};

		setMessages((prev) => [...prev, newMessage]);
	}, []);

	/**
	 * Send typing indicator
	 */
	const sendTyping = useCallback((isTyping: boolean) => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			return;
		}

		const payload: SendTypingPayload = {
			type: "typing",
			isTyping,
		};

		wsRef.current.send(JSON.stringify(payload));
	}, []);

	/**
	 * Clear all messages
	 */
	const clearMessages = useCallback(() => {
		setMessages([]);
	}, []);

	/**
	 * Auto-connect on mount (if not lazy)
	 */
	useEffect(() => {
		if (!lazyInit) {
			connect();
		}

		return () => {
			disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Reconnect when user changes (login/logout)
	 */
	useEffect(() => {
		if (!lazyInit && wsRef.current) {
			// Reconnect with new user info
			disconnect();
			setTimeout(() => connect(), 500);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	return {
		messages,
		connectionStatus,
		isTyping,
		sendMessage,
		sendTyping,
		connect,
		disconnect,
		clearMessages,
	};
}
