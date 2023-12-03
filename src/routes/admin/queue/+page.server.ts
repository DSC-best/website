import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import { BotApprovalStatus } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	await requireActorRole(locals, Roles.Approver);

	const myPendingReview = await prisma.bot.findFirst({
		where: {
			approval_status: BotApprovalStatus.PENDING,
			approver_id: locals.actor?.id!
		}
	});

	if (myPendingReview) throw redirect(302, `/bots/${myPendingReview.id}`); // Approver should finish their review before reviewing another bot

	const pendingBots = await prisma.bot.findMany({
		where: {
			approval_status: BotApprovalStatus.PENDING,
			approver_id: null
		},
		take: 10,
		orderBy: {
			approval_request_time: 'asc'
		}
	});

	const pendingBotsCount = await prisma.bot.count({
		where: {
			approval_status: BotApprovalStatus.PENDING,
			approver_id: null
		}
	});

	return {
		pendingBots,
        pendingBotsCount
	};
}
