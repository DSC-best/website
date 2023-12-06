import prisma from '$lib/server/prisma';
import SafeBot from '$lib/structures/bot';
import { BotApprovalStatus } from '@prisma/client';
import { error } from '@sveltejs/kit';

export const _voteTimeout = 1000 * 60 * 60 * 12; // 12 hours

export async function load({ locals, params }) {
	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		},
		include: {
			owner: true
		}
	});

	if (!bot) throw error(404, 'Bot not found');

	let votingDisabled = false;
	let canVote = true;

	if (bot?.approval_status !== BotApprovalStatus.APPROVED) votingDisabled = true;

	let latestVote = locals.actor
		? await prisma.botVote.findFirst({
				where: {
					bot_id: bot.id,
					voter_id: locals.actor!.id
				},
				orderBy: {
					created_time: 'desc'
				}
		  })
		: null;

	if (latestVote) {
		if (Date.now() - latestVote.created_time.getTime() < _voteTimeout) {
			canVote = false;
		}
	}

	return {
		bot: SafeBot(bot),
		votingDisabled,
		latestVote,
		canVote,
		newVoteTime: (latestVote?.created_time || new Date())?.getTime() + _voteTimeout
	};
}
