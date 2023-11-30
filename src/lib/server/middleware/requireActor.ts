import { error } from '@sveltejs/kit';

export default async function requireActor(locals: App.Locals) {
	if (!locals.actor) throw error(401, 'Login required');
    
}
