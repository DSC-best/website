export interface IBotTag {
	id: string;
	materialIcon: string | null;
	name: string;
	description: string;
}

const botTags: IBotTag[] = [
	{
		id: 'fun',
		materialIcon: 'emoji_emotions',
		name: 'Fun',
		description: 'Fun commands'
	},
	{
		id: 'moderation',
		materialIcon: 'security',
		name: 'Moderation',
		description: 'Moderation commands'
	}
];

export default botTags;
