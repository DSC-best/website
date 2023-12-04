import requireActorRole from '$lib/server/middleware/requireActorRole';
import prisma from '$lib/server/prisma';
import { RoleUtility, Roles } from '$lib/server/roles';
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ locals, params, request }) {
	await requireActorRole(locals, Roles.Owner);

	let { role } = await request.json();

	role = new Set(role);

	// roles to normal number
	let newRoles = Roles.User;

	const validRoles = RoleUtility.getValidRoles();

	for (let r of role) {
		if (!validRoles.includes(r)) return json({ message: 'Invalid role provided' }, { status: 400 });
		newRoles = RoleUtility.addRole(newRoles, r);
	}

	if (RoleUtility.hasRole(newRoles, Roles.System))
		return json({ message: 'Cannot set System role (this is automatic...)' }, { status: 400 });

	const user = await prisma.user.findUnique({
		where: {
			id: params.user_id
		}
	});

	if (!user) return json({ message: 'User not found' }, { status: 404 });

	if (user.id === locals.actor?.id)
		return json({ message: 'Cannot change your own role' }, { status: 400 });

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			role: newRoles
		}
	});

	return json({ message: 'OK', role: newRoles });
}
