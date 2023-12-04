import { InternalColors } from '$lib/server/colors';
import ChannelLog from '$lib/server/discord/channelLog';
import { kickUser } from '$lib/server/discord/user';
import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { RoleUtility, Roles } from '$lib/server/roles';
import snowflake from '$lib/server/snowflake';
import { BotApprovalStatus } from '@prisma/client';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ locals, params }) {
	await requireActorRole(locals, Roles.Moderator);

	const user = await prisma.user.findUnique({
		where: {
			id: params.user_id
		}
	});

	if (!user) return json({ message: 'User not found' }, { status: 404 });

	if (user.id === locals.actor?.id)
		return json({ message: 'Cannot change your own status' }, { status: 400 });

	const hasStronger = RoleUtility.hasStrongerRoles(locals.actor?.role!, user.role);

	if (!hasStronger)
		return json(
			{ message: 'Cannot change status of user with stronger role than you' },
			{ status: 400 }
		);

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			banned: !user.banned,
			role: Roles.User
		}
	});

	let botIds = await prisma.bot.findMany({
		where: {
			owner_id: user.id,
			approval_status: BotApprovalStatus.APPROVED
		},
		select: {
			id: true
		}
	});

	if (botIds.length > 0) {
		await prisma.bot.updateMany({
			where: {
				id: {
					in: botIds.map((b) => b.id)
				}
			},
			data: {
				approval_status: BotApprovalStatus.REJECTED
			}
		});

		await prisma.botApprovalLog.createMany({
			data: botIds.map((b) => ({
				id: snowflake.getUniqueID().toString(),
				bot_id: b.id,
				op_id: locals.actor!.id!,
				status: BotApprovalStatus.REJECTED,
				reason: 'Bot owner banned'
			}))
		});

		for (let bot of botIds) {
			await channelLog.sendLog(
				`Bot Removed`,
				`Bot <@!${bot.id}> was removed because the owner was banned`,
				user?.id,
				InternalColors.Red
			);
			try {
				await kickUser(bot?.id);
			} catch (error) {
				console.error(error);
			}
		}
	}

	return json({ message: 'OK', banned: !user.banned, role: Roles.User });
}
