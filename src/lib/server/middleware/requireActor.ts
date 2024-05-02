import { error } from '@sveltejs/kit';

export default async function requireActor(locals: App.Locals) {
	if (!locals.actor) throw error(401, 'Login required');

	if (locals.actor.banned) throw error(403, 'You are banned ');
}
