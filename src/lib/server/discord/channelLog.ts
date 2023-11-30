import { EmbedBuilder, type TextChannel } from 'discord.js';
import bot from './bot';

export default class ChannelLog {
	async sendLog(title: string, message: string) {
		const guild = await bot.guilds.fetch(process.env.GUILD_ID!);

		if (!guild) throw new Error('Guild not found');

		const channel = guild.channels.cache.find((c) => c.id === process.env.GUILD_LOGS_ID!);

		if (!channel) throw new Error('Logs Channel not found');

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setTimestamp()
			.setDescription(message)
			.setFooter({
				text: 'Powered by DSC.best'
			});

		(channel as TextChannel).send({ embeds: [embed] });
	}
}
