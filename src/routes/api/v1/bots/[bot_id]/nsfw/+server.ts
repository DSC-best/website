import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import { json } from '@sveltejs/kit';

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
			nsfw: !bot.nsfw
		}
	});

	return json({ message: 'OK', nsfw: !bot.nsfw });
}
