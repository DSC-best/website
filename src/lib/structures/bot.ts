import type { Bot, User } from '@prisma/client';
import SafeUser from './user';

export default function SafeBot(bot: Bot | null, actor?: User) {
	return {
		id: bot?.id,
		avatar: bot?.avatar,
		username: bot?.global_name || bot?.username,
		banner_color: bot?.banner_color,
		discriminator: bot?.discriminator,
		vote_count: bot?.vote_count,
		tagline: bot?.tagline,
		description: bot?.description,
		tags: bot?.tags,
		nsfw: bot?.nsfw,
		verified: bot?.verified,
		featured: bot?.featured,
		guild_count: bot?.guild_count,
		shard_count: bot?.shard_count,
		links: bot?.links,
		invite: bot?.invite,
		tos_link: bot?.tos_link,
		privacy_link: bot?.privacy_link,
		approval_status: bot?.approval_status,
		owner_id: bot?.owner_id,
		owner: (bot as any)?.owner ? SafeUser((bot as any)?.owner) : null,
		approver: (bot as any)?.approver ? SafeUser((bot as any)?.approver) : null,
		approved_time: bot?.approved_time,
		created_time: bot?.created_time,
		modified_time: bot?.modified_time
	};
}
