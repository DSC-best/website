import SafeUser from '$lib/structures/user';
import type { User } from '@prisma/client';
import '$lib/server/discord/bot';
import { RoleUtility, Roles } from '$lib/server/roles';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	const isApprover = RoleUtility.hasRole(locals?.actor?.role!, Roles.Approver);
	let botQueueCount = 0;

	if (isApprover) {
		botQueueCount = await prisma.bot.count({
			where: {
				approval_status: 'PENDING',
				OR: [
					{
						approver_id: locals.actor?.id!
					},
					{
						approver_id: null
					}
				]
			}
		});
	}

	return {
		actor: locals?.actor ? SafeUser(locals.actor as User | null) : null,
		isApprover,
		botQueueCount
	};
}
