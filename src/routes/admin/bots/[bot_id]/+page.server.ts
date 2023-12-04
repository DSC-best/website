import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import SafeBot from '$lib/structures/bot.js';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	await requireActorRole(locals, Roles.Moderator);

	const bot = await prisma.bot.findFirst({
		where: {
			id: params.bot_id
		},
		include: {
			owner: true,
			approver: true
		}
	});

	if (!bot) throw error(404, 'Bot not found');

	return {
		bot: SafeBot(bot)
	};
}
