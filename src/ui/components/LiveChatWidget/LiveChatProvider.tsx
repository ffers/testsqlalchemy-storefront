import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LiveChatWidget } from "./LiveChatWidget";
import type { ChatUser } from "@/lib/crm-chat";

/**
 * Server Component wrapper for LiveChatWidget
 * Fetches current user data and passes it to the client component
 */
export async function LiveChatProvider() {
	// Fetch current user from Saleor
	const { me } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	// Map Saleor user to ChatUser
	const chatUser: ChatUser | null = me
		? {
				id: me.id,
				email: me.email,
				firstName: me.firstName || undefined,
				lastName: me.lastName || undefined,
		  }
		: null;

	return <LiveChatWidget user={chatUser} />;
}
