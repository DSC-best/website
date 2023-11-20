import { IJwtObjectType, decodeJwtToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';

export async function handle({ event, resolve }) {
	try {
		event.locals.actor = null;

		const tokenCookie = event.cookies.get('token');

		if (tokenCookie) {
			const tokenData = decodeJwtToken(tokenCookie);

			if (!tokenData) return resolve(event);

			if (tokenData?.objectType === IJwtObjectType.USER) {
				event.locals.actor = await prisma.user.findUnique({
					where: {
						id: tokenData.objectId
					}
				});

				if (!event.locals.actor) {
					event.locals.actor = null;
					event.cookies.delete('token');
				}

				if (event.locals.actor?.banned)
					return new Response('You are banned from this site.', {
						status: 403
					});
			}
		}

		return resolve(event);
	} catch (e) {
		console.trace(e);
		return new Response('Uh, something went wrong... This is awkward...', {
			status: 500
		});
	}
}
