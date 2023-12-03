import type { IBotTag } from '$lib/server/botTags';
import botTags from '$lib/server/botTags';
import { InternalColors } from '$lib/server/colors';
import ChannelLog from '$lib/server/discord/channelLog';
import { getDiscordUserById, getMemberInServer } from '$lib/server/discord/user';
import { isValidHex } from '$lib/server/hexColorValidator';
import makeAvatarUrl from '$lib/server/makeAvatar';
import requireActor from '$lib/server/middleware/requireActor';
import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

const channelLog = new ChannelLog();

export async function POST({ locals, request, params }) {
	const botId = params.bot_id;
	const { tagline, inviteUrl, description, tags, isNSFW, bannerColor } = await request.json();

	await requireActor(locals);

	const botNSFW = isNSFW === true ? true : false;

	const bot = await prisma.bot.findUnique({
		where: {
			id: botId
		}
	});

	if (!bot)
		return json(
			{
				message: 'Bot not in database'
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

	const newBot = await prisma.bot.update({
		where: {
			id: botId
		},
		data: {
			avatar: makeAvatarUrl(discordUser?.id, discordUser?.avatar),
			username: discordUser?.username,
			discriminator: discordUser?.discriminator,
			global_name: discordUser?.global_name,
			description: description,
			invite: inviteUrl,
			nsfw: botNSFW,
			tagline: tagline,
			banner_color: bannerColor,
			tags: tagIds
		}
	});

	await channelLog.sendLog(
		'Bot Updated!',
		`Bot <@!${botId}> was updated by <@!${locals.actor?.id!}>`,
		locals.actor?.id!,
		InternalColors.Green
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
