import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { _voteTimeout } from '../../../../../bots/[bot_id]/vote/+page.server';
import { BotApprovalStatus } from '@prisma/client';
import snowflake from '$lib/server/snowflake';

export async function POST({ locals, params }) {
	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		},
		include: {
			owner: true
		}
	});

	if (!bot) return json({ message: 'Bot not found' }, { status: 404 });

	if (bot?.approval_status !== BotApprovalStatus.APPROVED)
		return json({ message: 'Voting is disabled for this bot' }, { status: 403 });

	const latestVote = await prisma.botVote.findFirst({
		where: {
			bot_id: bot.id,
			voter_id: locals.actor!.id
		}
	});

	if (latestVote) {
		if (Date.now() - latestVote.created_time.getTime() < _voteTimeout)
			return json(
				{
					message: 'You must wait before voting again',
					time: Date.now() + _voteTimeout - latestVote.created_time.getTime()
				},
				{ status: 403 }
			);
	}

	await prisma.botVote.create({
		data: {
			id: snowflake.getUniqueID().toString(),
			bot_id: bot.id,
			voter_id: locals.actor!.id
		}
	});

	await prisma.bot.update({
		where: {
			id: bot.id
		},
		data: {
			vote_count: {
				increment: 1
			}
		}
	});

	return json({ message: 'OK' });
}
