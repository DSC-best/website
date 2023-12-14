import { APP_URL } from '$env/static/private';

export function embedBotUsername(botId: string, botName: string) {
	return `[${botName}](${APP_URL}/bots/${botId})`;
}

export function embedUserUsername(userId: string, userName: string) {
	return `[${userName}](${APP_URL}/users/${userId})`;
}
