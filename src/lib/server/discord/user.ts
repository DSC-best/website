import { BOT_ROLE_ID, BOT_TOKEN, GUILD_ID } from '$env/static/private';
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

export async function giveRoleToMember(uid: string, roleId: string) {
	const member = await getMemberInServer(uid);

	if (!member) throw new Error('Member not found in server');

	const guild = await bot.guilds.fetch(GUILD_ID);

	if (!guild) throw new Error('Guild not found');

	const role = guild.roles.cache.get(roleId);

	if (!role) throw new Error('Role not found');

	await member.roles.add(role);

	return true;
}

export async function kickUser(uid: string) {
	const member = await getMemberInServer(uid);

	if (!member) throw new Error('Member not found in server');

	await member.kick();

	return true;
}
