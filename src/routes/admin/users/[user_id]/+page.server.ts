import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { RoleNameMap, RoleUtility, Roles } from '$lib/server/roles';
import SafeUser from '$lib/structures/user';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	await requireActorRole(locals, Roles.Moderator);

	const user = await prisma.user.findFirst({
		where: {
			id: params.user_id
		}
	});

	if (!user) throw error(404, 'User not found');

	const roleIds = RoleUtility.getAllRoles(RoleUtility.rolesToNumber());

	const allRoles: {
		id: number;
		label: string;
	}[] = [];
	const rolesSelected: number[] = [];

	for (const id of roleIds) {
		const nameMap = (RoleNameMap as any)?.[id];

		if (nameMap?.label) {
			allRoles.push({
				id: Number(id),
				label: nameMap?.label
			});
			if (RoleUtility.hasRole(user.role, id)) rolesSelected.push(Number(id));
		}
	}

	return {
		user: SafeUser(user),
		allRoles,
		rolesSelected
	};
}
