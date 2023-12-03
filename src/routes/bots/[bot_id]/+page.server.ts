import { BotApprovalStatus } from '@prisma/client';
import allBotTags, { type IBotTag } from '$lib/server/botTags';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import SafeBot from '$lib/structures/bot';
import { RoleUtility, Roles } from '$lib/server/roles.js';

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

	if (bot?.approval_status === BotApprovalStatus.BANNED)
		throw error(401, 'This bot has been banned for violating our terms of service');

	const botTags: IBotTag[] = [];

	for (const tagId of bot?.tags || []) {
		const tag = allBotTags.find((tag) => tag.id === tagId);
		if (tag) botTags.push(tag);
	}

	let isPendingAndActorIsApprover: boolean = false;

	if (locals.actor) {
		if (
			RoleUtility.hasRole(locals.actor.role, Roles.Approver) &&
			bot.approval_status === BotApprovalStatus.PENDING &&
			bot.approver_id === locals.actor.id
		)
			isPendingAndActorIsApprover = true;
	}

	let canResubmit: boolean = false;

	if (locals?.actor?.id === bot?.owner_id) {
		if (bot.approval_status === BotApprovalStatus.REJECTED) {
			canResubmit = true;
		}
	}

	return {
		botTags,
		bot: SafeBot(bot),
		isPendingAndActorIsApprover,
		canResubmit
	};
}
