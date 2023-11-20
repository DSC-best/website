import { CLIENT_ID, CLIENT_SECRET, APP_URL } from '$env/static/private';
import { IJwtObjectType, createJwtToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import { Roles } from '$lib/server/roles';
import { redirect } from '@sveltejs/kit';
import axios from 'axios';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

export async function GET({ url, cookies }) {
	const returnCode = url.searchParams.get('code');

	//? Prepare data for Discord
	const discordData = {
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: `${APP_URL}/api/v1/auth/callback`,
		code: returnCode,
		scope: 'identify guilds'
	};

	const { data } = await axios.post('https://discord.com/api/oauth2/token', discordData, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	if (data?.error) throw redirect(302, '/');

	//? Prepare data for backend, get user data
	const { data: userData } = await axios.get('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${data.access_token}`
		}
	});

	if (!userData?.id) throw redirect(302, '/');

	console.log(userData)

	let avatarUrl = userData?.avatar;

	//? a_ prefix means animated avatar
	if (avatarUrl?.startsWith('a_'))
		avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${avatarUrl}.gif`;
	else avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${avatarUrl}.webp`;

	//? Save User in Database
	const saved = await prisma.user.upsert({
		where: {
			id: userData?.id
		},
		create: {
			id: userData?.id,
			username: userData?.username,
			global_name: userData?.global_name,
			discriminator: userData?.discriminator,
			avatar: avatarUrl,
			locale: userData?.locale,
			role: Roles.User
		},
		update: {
			username: userData?.username,
			global_name: userData?.global_name,
			discriminator: userData?.discriminator,
			avatar: avatarUrl,
			locale: userData?.locale
		}
	});

	//? Create token for user
	const accountToken = createJwtToken(saved.id, IJwtObjectType.USER);

	//? Save token in cookie
	cookies.set('token', accountToken, {
		path: '/',
		httpOnly: false,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	//? Redirect to home page
	throw redirect(302, '/');
}
