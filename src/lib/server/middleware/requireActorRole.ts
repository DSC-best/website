import { error } from '@sveltejs/kit';
import { RoleUtility, type Roles } from '../roles';

export default async function requireActorRole(locals: App.Locals, role: Roles) {
	if (!locals.actor) throw error(401, 'Login required');

	if (!RoleUtility.hasMinRole(locals.actor.role, role))
		throw error(403, 'You do not have permission to perform this action');
}
