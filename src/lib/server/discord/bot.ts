import { Client, Events, GatewayIntentBits } from 'discord.js';
import { BOT_TOKEN, CLIENT_ID } from '$env/static/private';
import prisma from '../prisma';
import { BotApprovalStatus } from '@prisma/client';
import snowflake from '../snowflake';
import ChannelLog from './channelLog';
import { InternalColors } from '../colors';
import makeAvatarUrl from '../makeAvatar';
import SafeBot from '$lib/structures/bot';
import { embedBotUsername } from '../embedHelper';

//? The amount of these intents is crazy....
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildModeration
	]
});

client.on(Events.ClientReady, (bot) => {
	console.log(`Discord bot online as ${bot?.user?.tag}`);
});

client.on(Events.GuildMemberRemove, async (member) => {
	if (!member.user.bot) return;

	const channelLog = new ChannelLog();

	const bot = await prisma.bot.findUnique({
		where: {
			id: member.id
		}
	});

	if (!bot) return;

	await prisma.bot.update({
		where: {
			id: bot.id
		},
		data: {
			approval_status: BotApprovalStatus.REJECTED
		}
	});

	if (bot.approval_status === BotApprovalStatus.APPROVED) {
		await prisma.botApprovalLog.create({
			data: {
				id: snowflake.getUniqueID()?.toString(),
				bot_id: bot.id,
				op_id: CLIENT_ID,
				status: BotApprovalStatus.REJECTED,
				reason: 'Bot left the server'
			}
		});
		try {
			const safeBot = SafeBot(bot);

			await channelLog.sendLog(
				'Bot Automatically Rejected!',
				`Bot ${embedBotUsername(
					safeBot?.id!,
					safeBot?.username!
				)} left the server, so it was automatically rejected.`,
				null,
				InternalColors.Red
			);
		} catch (e) {
			console.trace(e);
		}
	}
});

client.on(Events.UserUpdate, async (oldUser, newUser) => {
	try {
		if (newUser.bot) {
			const bot = await prisma.bot.findUnique({
				where: {
					id: newUser.id
				}
			});

			if (!bot) return;

			await prisma.bot.update({
				where: {
					id: bot.id
				},
				data: {
					username: newUser?.username,
					global_name: newUser?.globalName,
					discriminator: newUser?.discriminator,
					avatar: makeAvatarUrl(newUser?.id, newUser?.avatar!)
				}
			});
		} else {
			const user = await prisma.user.findUnique({
				where: {
					id: newUser.id
				}
			});

			if (!user) return;

			await prisma.user.update({
				where: {
					id: newUser.id
				},
				data: {
					username: newUser?.username,
					global_name: newUser?.globalName,
					discriminator: newUser?.discriminator,
					avatar: makeAvatarUrl(newUser?.id, newUser?.avatar!)
				}
			});
		}
	} catch (e) {
		console.trace(e);
	}
});

//? Login to the bot
client.login(BOT_TOKEN);

export default client;
