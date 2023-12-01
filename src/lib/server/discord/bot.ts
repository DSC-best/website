import { Client, Events, GatewayIntentBits } from 'discord.js';
import { BOT_TOKEN } from '$env/static/private';

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

//? Login to the bot
client.login(BOT_TOKEN);

export default client;
