export default function makeAvatarUrl(uid: string, hash?: string): string {
	let avatarUrl = '';

	if (hash?.startsWith('a_')) avatarUrl = `https://cdn.discordapp.com/avatars/${uid}/${hash}.gif`;
	else avatarUrl = `https://cdn.discordapp.com/avatars/${uid}/${hash}.webp`;

	if (!hash) avatarUrl = `https://cdn.discordapp.com/embed/avatars/${(Number(uid) >> 22) % 6}.png`;

	return avatarUrl;
}
