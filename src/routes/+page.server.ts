import prisma from '$lib/server/prisma';
import SafeBot from '$lib/structures/bot';
import botTags from '$lib/server/botTags';

export async function load({}) {
	const newBots = await prisma.bot.findMany({
		where: {
			approval_status: "APPROVED"
		},
		orderBy: {
			approved_time: 'desc'
		},
		take: 6
	});

	return {
		newBots: newBots.map((bot) => SafeBot(bot)),
		topBots: newBots.map((bot) => SafeBot(bot)),
		botTags
	};
}
