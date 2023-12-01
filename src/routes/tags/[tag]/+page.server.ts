import botTags from '$lib/server/botTags';
import prisma from '$lib/server/prisma';
import SafeBot from '$lib/structures/bot';
import { BotApprovalStatus } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
	const page = url.searchParams.get('p');
	const limit = 20;
	const parsedPage = parseInt(page || '0');

	const botTag = botTags.find((tag) => tag.id === params.tag);

	if (!botTag) throw error(404, 'Tag not found');

	const bots = await prisma.bot.findMany({
		where: {
			tags: {
				has: params.tag
			},
			approval_status: BotApprovalStatus.APPROVED
		},
		orderBy: {
			vote_count: 'desc'
		},
		skip: parsedPage * limit,
		take: limit
	});

	return {
		results: bots.map((bot) => SafeBot(bot)),
		botTags,
		limit,
		page: parsedPage,
		tag: botTag
	};
}
