import { InternalColors } from '$lib/server/colors';
import ChannelLog from '$lib/server/discord/channelLog';
import { kickUser } from '$lib/server/discord/user.js';
import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import snowflake from '$lib/server/snowflake';
import { BotApprovalStatus } from '@prisma/client';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ locals, params, request }) {
	await requireActorRole(locals, Roles.Moderator);

	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		}
	});

	if (!bot) return json({ message: 'Bot not found' }, { status: 404 });

	await prisma.bot.update({
		where: {
			id: bot.id
		},
		data: {
			approver_id: null,
			approval_reason: null,
			approved_time: null,
			approval_status: BotApprovalStatus.REJECTED
		}
	});

	await prisma.botApprovalLog.create({
		data: {
			id: snowflake.getUniqueID().toString(),
			bot_id: bot.id,
			op_id: locals.actor!.id!,
			status: BotApprovalStatus.REJECTED,
			reason: 'Forced rejection'
		}
	});

	await channelLog.sendLog(
		`Forced Rejection`,
		`<@!${locals.actor!.id}> has forced rejected <@!${bot.owner_id}>'s bot <@!${bot.id}>`,
		bot?.owner_id,
		InternalColors.Red
	);

	try {
		await kickUser(bot?.id);
	} catch (error) {
		console.error(error);
	}

	return json({ message: 'OK', approval_status: BotApprovalStatus.REJECTED });
}
