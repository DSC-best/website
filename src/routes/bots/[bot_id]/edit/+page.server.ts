import { BotApprovalStatus } from '@prisma/client';
import allBotTags from '$lib/server/botTags';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import SafeBot from '$lib/structures/bot';
import { GUILD_INVITE } from '$env/static/private';

export async function load({ locals, params }) {
	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id,
			NOT: {
				approval_status: BotApprovalStatus.BANNED
			}
		}
	});

	if (!bot) throw error(404, 'Bot unavailable');

	return {
		allBotTags,
		bot: SafeBot(bot),
		guildInvite: GUILD_INVITE
	};
}