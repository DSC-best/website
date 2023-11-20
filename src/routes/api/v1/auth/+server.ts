import { redirect } from '@sveltejs/kit';
import { CLIENT_ID, APP_URL } from '$env/static/private';

const CALLBACK_URL = `${APP_URL}/api/v1/auth/callback`;
const DISCORD_REDIRECT_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
	CALLBACK_URL
)}&response_type=code&scope=identify%20guilds`;

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
	throw redirect(302, DISCORD_REDIRECT_URL);
}
