import { PrismaClient } from '@prisma/client';
import { getDiscordUserById } from './discord/user';
import { CLIENT_ID } from '$env/static/private';
import makeAvatarUrl from './makeAvatar';
import { RoleUtility, Roles } from './roles';
import { InternalColors } from './colors';

const prisma = new PrismaClient();

(async () => {
	try {
		const systemUserAccount = await getDiscordUserById(CLIENT_ID);

		if (!systemUserAccount) throw new Error('System user not found');

		const avatarUrl = makeAvatarUrl(systemUserAccount?.id, systemUserAccount?.avatar);

		let systemRoles = Roles.User;
		systemRoles = RoleUtility.addRole(systemRoles, Roles.System);

		await prisma.user.upsert({
			where: {
				id: systemUserAccount?.id
			},
			create: {
				id: systemUserAccount?.id,
				banner_color: InternalColors.Blurple,
				username: systemUserAccount?.username,
				global_name: systemUserAccount?.global_name,
				discriminator: systemUserAccount?.discriminator,
				avatar: avatarUrl,
				locale: systemUserAccount?.locale,
				role: systemRoles
			},
			update: {
				username: systemUserAccount?.username,
				banner_color: InternalColors.Blurple,
				global_name: systemUserAccount?.global_name,
				discriminator: systemUserAccount?.discriminator,
				avatar: avatarUrl,
				locale: systemUserAccount?.locale,
				role: systemRoles
			}
		});
	} catch (error) {
		console.trace(error);
	}
})();

export default prisma;
