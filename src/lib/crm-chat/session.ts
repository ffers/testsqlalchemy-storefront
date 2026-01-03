/**
 * CRM Chat Session Management
 * Manages chat session ID in localStorage for persistent chat history
 */

const CHAT_SESSION_KEY = "crm_chat_session_id";

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get existing session ID or create a new one
 */
export function getChatSessionId(): string {
	if (typeof window === "undefined") return "";

	let sessionId = localStorage.getItem(CHAT_SESSION_KEY);

	if (!sessionId) {
		sessionId = generateSessionId();
		localStorage.setItem(CHAT_SESSION_KEY, sessionId);
	}

	return sessionId;
}

/**
 * Clear chat session (for logout or reset)
 */
export function clearChatSession(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(CHAT_SESSION_KEY);
}

/**
 * Set a specific session ID (useful for authenticated users)
 */
export function setChatSessionId(sessionId: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(CHAT_SESSION_KEY, sessionId);
}
