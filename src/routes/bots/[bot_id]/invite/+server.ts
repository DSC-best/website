import prisma from '$lib/server/prisma';
import { BotApprovalStatus } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ params }) {
	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		}
	});

	if (!bot) throw error(404, 'Bot not found');

	if (
		bot?.approval_status === BotApprovalStatus.BANNED ||
		bot?.approval_status === BotApprovalStatus.REJECTED
	)
		throw error(401, 'Whoops, this bot is not available to invite');

	//? We could use this endpoint for statistics

	throw redirect(302, bot.invite);
}
