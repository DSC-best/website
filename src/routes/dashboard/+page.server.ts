import type { User } from '@prisma/client';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	return {
		actor: locals.actor as User | null
	};
}
