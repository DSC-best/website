import prisma from '$lib/server/prisma';
import SafeBot from '$lib/structures/bot';
import { BotApprovalStatus } from '@prisma/client';
import botTags from '$lib/server/botTags';

export async function load({ url }) {
	const query = url.searchParams.get('q');
	const page = url.searchParams.get('p');

	const limit = 20;
	const parsedPage = parseInt(page || '0');

	const searchResults = await prisma.bot.findMany({
		where: {
			username: {
				startsWith: query || '',
				mode: 'insensitive'
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
		results: searchResults.map((bot) => SafeBot(bot)),
		botTags,
		limit,
		page: parsedPage,
		query: query || ''
	};
}
