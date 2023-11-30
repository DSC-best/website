import botTags from '$lib/server/botTags';
import requireActor from '$lib/server/middleware/requireActor';
import { GUILD_INVITE } from '$env/static/private';

export async function load({ locals }) {
	await requireActor(locals);

	return {
		botTags,
		guildInvite: GUILD_INVITE
	};
}
