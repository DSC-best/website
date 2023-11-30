import ChannelLog from '$lib/server/discord/channelLog';
import requireActor from '$lib/server/middleware/requireActor';
import prisma from '$lib/server/prisma';
import snowflake from '$lib/server/snowflake';
import SafeBot from '$lib/structures/bot';
import { BotApprovalStatus } from '@prisma/client';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ locals, params, request }) {
	await requireActor(locals);

	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		}
	});

	if (!bot) return json({ message: 'Bot not found' }, { status: 404 });

	if (bot.approval_status !== BotApprovalStatus.REJECTED)
		return json({ message: 'Bot is not rejected from approval' }, { status: 400 });

	await prisma.bot.update({
		where: {
			id: bot.id
		},
		data: {
			approval_status: BotApprovalStatus.PENDING,
			approver_id: null,
			approval_reason: null,
			approved_time: null
		}
	});

	await prisma.botApprovalLog.create({
		data: {
			id: snowflake.getUniqueID()?.toString(),
			bot_id: bot.id,
			op_id: locals.actor!.id!,
			status: BotApprovalStatus.PENDING,
			reason: 'Resubmitted bot'
		}
	});

	const safeBot = SafeBot(bot);

	await channelLog.sendLog(
		`Resubmitted bot in queue!`,
		`${safeBot.username} (<@!${safeBot.id}>) has been submitted to the queue by <@!${locals?.actor
			?.id!}>`
	);

	return json({ message: 'Bot resubmitted' });
}
