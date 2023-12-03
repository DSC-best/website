import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import snowflake from '$lib/server/snowflake';
import { BotApprovalStatus } from '@prisma/client';
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ locals, params }) {
	await requireActorRole(locals, Roles.Approver);

	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		}
	});

	if (!bot) return json({ message: 'Bot not found' }, { status: 404 });

	if (bot.approval_status !== BotApprovalStatus.PENDING)
		return json({ message: 'Bot is not pending approval' }, { status: 400 });

	if (bot.approver_id !== null) return json({ message: 'Bot is already claimed' }, { status: 400 });

	await prisma.bot.update({
		where: {
			id: bot.id
		},
		data: {
			approver_id: locals.actor!.id!,
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
			reason: 'Bot claimed by approver'
		}
	});

	return json({ message: 'Claimed bot' });
}
