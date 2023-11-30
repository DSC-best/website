import { Client, Events, GatewayIntentBits } from 'discord.js';
const BOT_TOKEN = process.env.BOT_TOKEN;

//? The amount of these intents is crazy....
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	]
});

client.on(Events.ClientReady, (bot) => {
	console.log(`Discord bot online as ${bot?.user?.tag}`);
});

//? Login to the bot
client.login(BOT_TOKEN);

export default client;
