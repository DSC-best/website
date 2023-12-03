import botTags from '$lib/server/botTags';
import prisma from '$lib/server/prisma';
import SafeBot from '$lib/structures/bot';
import { BotApprovalStatus } from '@prisma/client';

export async function load({ url }) {
	const page = url.searchParams.get('p');
	const limit = 20;
	const parsedPage = parseInt(page || '0');

	const bots = await prisma.bot.findMany({
		where: {
			approval_status: BotApprovalStatus.APPROVED
		},
		orderBy: {
			approved_time: 'desc'
		},
		skip: parsedPage * limit,
		take: limit
	});

	return {
		results: bots.map((bot) => SafeBot(bot)),
		botTags,
		limit,
		page: parsedPage
	};
}
