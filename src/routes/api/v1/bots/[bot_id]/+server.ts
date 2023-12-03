import { InternalColors } from '$lib/server/colors';
import ChannelLog from '$lib/server/discord/channelLog';
import { kickUser } from '$lib/server/discord/user.js';
import requireActor from '$lib/server/middleware/requireActor';
import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

export async function DELETE({ locals, params }) {
	await requireActor(locals);

	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id,
			owner_id: locals.actor?.id
		}
	});

	if (!bot) return json({ message: 'Bot not found' }, { status: 404 });

	await prisma.botApprovalLog.deleteMany({
		where: {
			bot_id: bot.id
		}
	});

	await prisma.botVote.deleteMany({
		where: {
			bot_id: bot.id
		}
	});

	await prisma.bot.delete({
		where: {
			id: bot.id
		}
	});

	try {
		await kickUser(bot.id);
	} catch (e) {
		console.error(e);
	}

	await channelLog.sendLog(
		`Bot deleted by author`,
		`Bot <@!${bot.id}> was deleted by <@!${locals?.actor?.id}>`,
		locals?.actor?.id,
		InternalColors.Red
	);

	return json({ message: 'OK' });
}
