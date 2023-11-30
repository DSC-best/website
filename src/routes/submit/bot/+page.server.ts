import botTags from '$lib/server/botTags';
import requireActor from '$lib/server/middleware/requireActor';

export async function load({ locals }) {
	await requireActor(locals);

	return {
		botTags,
		guildInvite: process.env.GUILD_INVITE!
	};
}
