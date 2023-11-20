import { BOT_TOKEN } from '$env/static/private';
import axios from 'axios';

export async function getDiscordUserById(uid: string | number) {
	if (!uid) return null;

	const { data } = await axios.get(`https://discord.com/api/users/${uid}`, {
		headers: {
			Authorization: `Bot ${BOT_TOKEN}`
		}
	});
	return data;
}
