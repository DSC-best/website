import prisma from '$lib/server/prisma';
import { BotApprovalStatus } from '@prisma/client';

export async function load({}) {
	const newBots = await prisma.bot.findMany({
		where: {
			approval_status: BotApprovalStatus.APPROVED
		},
		orderBy: {
			approved_time: 'desc'
		},
		take: 6
	});

	return {
		newBots: newBots,
		topBots: newBots
	};
}
