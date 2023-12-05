import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { _voteTimeout } from '../../../../../bots/[bot_id]/vote/+page.server';
import { BotApprovalStatus } from '@prisma/client';
import snowflake from '$lib/server/snowflake';
import ChannelLog from '$lib/server/discord/channelLog';
import { APP_URL } from '$env/static/private';
import SafeBot from '$lib/structures/bot';
import { InternalColors } from '$lib/server/colors';

const channelLog = new ChannelLog();

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
		},
		orderBy: {
			created_time: 'desc'
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

	const safeBot = SafeBot(bot);

	await channelLog.sendLog(
		`Bot voted for`,
		`Bot [${safeBot?.username}](${APP_URL}/bots/${bot?.id}) was voted for by <@!${locals?.actor
			?.id}>, now at ${bot?.vote_count + 1} votes`,
		null,
		InternalColors.Green
	);

	return json({ message: 'OK' });
}
