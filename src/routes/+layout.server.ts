import SafeUser from '$lib/structures/user.js';
import type { User } from '@prisma/client';
import '$lib/server/discord/bot.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	return {
		actor: locals?.actor ? SafeUser(locals.actor as User | null) : null
	};
}
