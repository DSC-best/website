import { EmbedBuilder, type TextChannel } from 'discord.js';
import { GUILD_ID, GUILD_LOGS_ID } from '$env/static/private';
import bot from './bot';
import { InternalColors } from '../colors';

export default class ChannelLog {
	/**
	 * Send a log to the logs channel
	 * @param title The title of the embed
	 * @param message The message of the embed
	 * @param userId The user id to send it privately to (a copy) (optional)
	 * @param color The color of the embed
	 */
	async sendLog(
		title: string,
		message: string,
		userId?: string | null,
		color: InternalColors = InternalColors.Green,
	) {
		const guild = await bot.guilds.fetch(GUILD_ID);

		if (!guild) throw new Error('Guild not found');

		const channel = guild.channels.cache.find((c) => c.id === GUILD_LOGS_ID);

		if (!channel) throw new Error('Logs Channel not found');

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setColor(color)
			.setTimestamp()
			.setDescription(message)
			.setFooter({
				text: 'Powered by DSC.best'
			});

		(channel as TextChannel).send({ embeds: [embed] });
		if (userId) {
			const user = await guild.members.fetch(userId);
			if (!user) return;
			user?.send({ embeds: [embed] });
		}
	}
}
