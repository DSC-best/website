import { InternalColors } from '$lib/server/colors.js';
import ChannelLog from '$lib/server/discord/channelLog';
import { embedBotUsername, embedUserUsername } from '$lib/server/embedHelper.js';
import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import snowflake from '$lib/server/snowflake';
import SafeBot from '$lib/structures/bot.js';
import { BotApprovalStatus } from '@prisma/client';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ locals, params, request }) {
	await requireActorRole(locals, Roles.Approver);

	const { note } = await request.json();

	if (!note)
		return json(
			{ message: 'No note provided' },
			{
				status: 400
			}
		);

	if (note.length < 20)
		return json({ message: 'Note must be at least 20 characters long' }, { status: 400 });

	if (note.length > 400)
		return json({ message: 'Note must be at most 400 characters long' }, { status: 400 });

	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		}
	});

	if (!bot) return json({ message: 'Bot not found' }, { status: 404 });

	if (bot.approval_status !== BotApprovalStatus.PENDING)
		return json({ message: 'Bot is not pending approval' }, { status: 400 });

	await prisma.bot.update({
		where: {
			id: bot.id
		},
		data: {
			approval_status: BotApprovalStatus.REJECTED,
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
			status: BotApprovalStatus.REJECTED,
			reason: note
		}
	});

	const safeBot = SafeBot(bot);

	await channelLog.sendLog(
		`Bot Rejected!`,
		`**Bot:** ${embedBotUsername(
			safeBot?.id!,
			safeBot?.username!
		)}\n**Approver:** ${embedUserUsername(
			locals?.actor?.id!,
			locals?.actor?.username!
		)}\n**Reason:** ${note}`,
		bot?.owner_id,
		InternalColors.Red
	);

	return json({ message: 'Bot rejected' });
}
