import { BOT_TOKEN, GUILD_ID } from '$env/static/private';
import axios from 'axios';
import bot from './bot';

export async function getDiscordUserById(uid: string | number) {
	if (!uid) return null;

	const { data } = await axios.get(`https://discord.com/api/users/${uid}`, {
		headers: {
			Authorization: `Bot ${BOT_TOKEN}`
		}
	});
	return data;
}

export async function getMemberInServer(uid: string) {
	const guild = await bot.guilds.fetch(GUILD_ID);

	if (!guild) throw new Error('Guild not found');

	try {
		const member = await guild.members.fetch(uid);

		if (!member) throw new Error('Member not found');

		return member;
	} catch (e) {
		return null;
	}
}
