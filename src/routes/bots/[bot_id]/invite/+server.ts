import prisma from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ params }) {
	const bot = await prisma.bot.findUnique({
		where: {
			id: params.bot_id
		}
	});

	if (!bot) throw error(404, 'Bot not found');

	//? We could use this endpoint for statistics

	throw redirect(302, bot.invite);
}
