import { redirect } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ locals, cookies }) {
	cookies.delete('token', { path: '/' });
	locals.actor = null;
    
	throw redirect(302, '/');
}
