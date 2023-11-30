import type { User } from '@prisma/client';

export default function SafeUser(user: User | null, actor?: User) {
	return {
		id: user?.id,
		banner_color: user?.banner_color,
		avatar: user?.avatar,
		username: user?.global_name || user?.username + '#' + user?.discriminator,
		discriminator: user?.discriminator,
		locale: user?.locale,
		role: user?.role,
		banned: user?.banned,
		created_time: user?.created_time,
		modified_time: user?.modified_time
	};
}
