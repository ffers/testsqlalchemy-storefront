/**
 * CRM Chat Types
 */

export type MessageDirection = "incoming" | "outgoing";

export interface ChatMessage {
	id: string;
	text: string;
	direction: MessageDirection;
	timestamp: string;
	sender?: string;
	senderName?: string;
}

export interface ChatUser {
	id: string;
	email?: string;
	firstName?: string;
	lastName?: string;
}

export interface WebSocketMessage {
	type: "message" | "typing" | "history" | "error" | "connected";
	text?: string;
	messages?: ChatMessage[];
	isTyping?: boolean;
	error?: string;
}

export interface SendMessagePayload {
	type: "message";
	text: string;
}

export interface SendTypingPayload {
	type: "typing";
	isTyping: boolean;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";
