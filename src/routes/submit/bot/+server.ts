import type { IBotTag } from '$lib/server/botTags';
import botTags from '$lib/server/botTags';
import ChannelLog from '$lib/server/discord/channelLog';
import { getDiscordUserById, getMemberInServer } from '$lib/server/discord/user';
import { embedBotUsername, embedUserUsername } from '$lib/server/embedHelper.js';
import { isValidHex } from '$lib/server/hexColorValidator.js';
import makeAvatarUrl from '$lib/server/makeAvatar';
import requireActor from '$lib/server/middleware/requireActor';
import prisma from '$lib/server/prisma';
import SafeBot from '$lib/structures/bot.js';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

export async function POST({ locals, request }) {
	const {
		id: botId,
		tagline,
		inviteUrl,
		description,
		tags,
		isNSFW,
		bannerColor
	} = await request.json();

	await requireActor(locals);

	const botNSFW = isNSFW === true ? true : false;

	const bot = await prisma.bot.findUnique({
		where: {
			id: botId
		}
	});

	if (bot)
		return json(
			{
				message: 'Bot is already in our database!'
			},
			{
				status: 401
			}
		);

	if (!bannerColor)
		return json(
			{
				message: 'Banner color is required!'
			},
			{
				status: 401
			}
		);

	if (bannerColor.length > 7)
		return json(
			{
				message: 'Banner color may not be longer than 7 characters!'
			},
			{
				status: 401
			}
		);

	if (!isValidHex(bannerColor))
		return json(
			{
				message: 'Banner color is not a valid hex color!'
			},
			{
				status: 401
			}
		);

	if (tagline.length > 150)
		return json(
			{
				message: 'Tagline may not be longer than 150 characters!'
			},
			{
				status: 401
			}
		);

	if (description.length > 5000)
		return json(
			{
				message: 'Description may not be longer than 5000 characters!'
			},
			{
				status: 401
			}
		);

	if (tags.length > 10)
		return json(
			{
				message: 'You may not have more than 10 tags!'
			},
			{
				status: 401
			}
		);

	if (tags.length < 1)
		return json(
			{
				message: 'You must have at least 1 tag!'
			},
			{
				status: 401
			}
		);

	if (inviteUrl.length > 255)
		return json(
			{
				message: 'Invite URL may not be longer than 255 characters!'
			},
			{
				status: 401
			}
		);

	const tagIds = tags.map((tag: IBotTag) => tag.id);

	// check if tagIds are valid
	for (const tagId of tagIds) {
		if (!botTags.find((tag) => tag.id === tagId))
			return json(
				{
					message: 'Invalid tag!'
				},
				{
					status: 401
				}
			);
	}

	const memberOfServer = await getMemberInServer(locals?.actor?.id!);

	if (!memberOfServer)
		return json(
			{
				message: 'You must be in the official server to submit a bot!'
			},
			{
				status: 401
			}
		);

	let discordUser: any = null;

	try {
		discordUser = await getDiscordUserById(botId);
	} catch (e: any) {
		let errorMessage: string[] = [];

		console.log(e.response.data);

		Object.keys(e.response.data).forEach((key) => {
			errorMessage.push(`${key}: ${e.response.data[key]}`);
		});

		return json(
			{
				message: errorMessage.join('\n')
			},
			{
				status: 401
			}
		);
	}

	if (!discordUser.bot)
		return json(
			{
				message: 'This user is not a bot!'
			},
			{
				status: 401
			}
		);

	const newBot = await prisma.bot.create({
		data: {
			id: botId,
			avatar: makeAvatarUrl(discordUser?.id, discordUser?.avatar),
			slug: discordUser?.id?.toString(),
			username: discordUser?.username,
			discriminator: discordUser?.discriminator,
			global_name: discordUser?.global_name,
			banner_color: bannerColor || discordUser?.banner_color,
			tagline: tagline,
			description: description,
			tags: tagIds,
			nsfw: botNSFW,
			owner: {
				connect: {
					id: locals?.actor?.id!
				}
			},
			invite: inviteUrl,
			approval_request_time: new Date()
		}
	});

	const safeBot = SafeBot(newBot);

	await channelLog.sendLog(
		`New bot in queue!`,
		`${embedBotUsername(
			safeBot?.id!,
			safeBot?.username!
		)} has been submitted to the queue by ${embedUserUsername(
			locals?.actor?.id!,
			locals?.actor?.username!
		)}`
	);

	return json(
		{
			message: 'Bot submitted successfully!',
			id: newBot.id
		},
		{
			status: 200
		}
	);
}
