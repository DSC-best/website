import { BotApprovalStatus, type User } from '@prisma/client';
import botTags from '$lib/server/botTags';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { RoleUtility, RoleNameMap, Roles } from '$lib/server/roles';
import SafeUser from '$lib/structures/user';
import SafeBot from '$lib/structures/bot';

export async function load({ locals, params }) {
	const user = await prisma.user.findUnique({
		where: {
			id: params.user_id
		}
	});

	if (!user) throw error(404, 'User not found');

	const isModerator = locals?.actor
		? RoleUtility.hasMinRole(locals.actor.role, Roles.Moderator)
		: false;

	if (user?.banned && !isModerator)
		throw error(401, 'This user has been banned for violating our terms of service');

	const userBots = await prisma.bot.findMany({
		where: {
			owner_id: user?.id || '',
			NOT: {
				approval_status: BotApprovalStatus.BANNED
			}
		}
	});

	const userBadges: any[] = [];

	for (const role of RoleUtility.getAllRoles(user?.role)) {
		if ((RoleNameMap as any)[role]) userBadges.push((RoleNameMap as any)[role]);
	}

	// sort userBadges by priority (highest to lowest)
	userBadges.sort((a, b) => b.priority - a.priority);

	return {
		botTags,
		user: SafeUser(user as User | null),
		userBots: userBots.map((bot) => SafeBot(bot)),
		userBadges
	};
}
