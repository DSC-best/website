<script lang="ts">
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import Button, { Label } from '@smui/button';
	import Chip, { Set, Text } from '@smui/chips';
	import TextField from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch';
	import { goto } from '$app/navigation';
	import axios from 'axios';

	export let data;

	let formData = {
		tagline: data.bot.tagline,
		inviteUrl: data.bot.invite,
		description: data.bot.description,
		bannerColor: data.bot.banner_color,
		tags: data.allBotTags.filter((t) => data?.bot?.tags?.includes(t.id)),
		isNSFW: data.bot.nsfw
	};

	let errorMessage: string = '';

	function handleSubmit() {
		axios
			.post('', formData)
			.then((d) => {
				goto(`/bots/${d.data.id}`);
			})
			.catch((e) => {
				errorMessage = e?.response?.data?.message;
			});
	}
</script>

<div class="paper-container align-flex-center">
	<Paper class="paper">
		<Title>Edit bot</Title>
		<Subtitle>
			Editing:
			<Button class="botbutton" on:click={() => goto(`/bots/${data?.bot?.id}`)}>
				{#if data?.bot}
					<img src={data?.bot?.avatar} alt="Avatar" class="botbutton-avatar" />
				{:else}
					<span class="material-icons">account_circle</span>
				{/if}
				<span class="botbutton-username">{data?.bot?.username ?? 'Unknown'}</span>
			</Button>
		</Subtitle>
		<Content>
			<form on:submit|preventDefault={handleSubmit}>
				<!-- error view -->
				{#if errorMessage}
					<div class="mb-2">
						<Paper color="primary" class="paper-theme--outline-danger">
							<Content>
								{errorMessage}
							</Content>
						</Paper>
					</div>
				{/if}

				<!-- Field for bot tagline -->
				<div class="mb-2">
					<TextField
						label="Tagline"
						bind:value={formData.tagline}
						variant="outlined"
						input$maxlength={150}
						required
						style="width: 100%;"
						helperLine$style="width: 100%;"
					>
						<svelte:fragment slot="helper">
							<HelperText>
								Keep it short and sweet, this will be displayed on the bot card.
							</HelperText>
						</svelte:fragment>
					</TextField>
				</div>

				<!-- Field for invite URL -->
				<div class="mb-2">
					<TextField
						label="Invite URL"
						bind:value={formData.inviteUrl}
						variant="outlined"
						required
						style="width: 100%;"
						helperLine$style="width: 100%;"
					>
						<svelte:fragment slot="helper">
							<HelperText>
								Try to not use Admin permissions for this, instead only use what you need for your
								bot.
							</HelperText>
						</svelte:fragment>
					</TextField>
				</div>

				<!-- Field for banner color -->
				<div class="mb-2">
					<TextField
						label="Banner Color"
						bind:value={formData.bannerColor}
						variant="outlined"
						required
						style="width: 100%;"
						helperLine$style="width: 100%;"
					>
						<svelte:fragment slot="helper">
							<HelperText>
								Provide a valid Hex color code to use as the banner color for your bot.
							</HelperText>
						</svelte:fragment>
					</TextField>
				</div>

				<!-- Field for invite URL -->
				<div class="mb-2">
					<TextField
						label="Bot Description"
						bind:value={formData.description}
						variant="outlined"
						input$maxlength={5000}
						required
						style="width: 100%;"
						helperLine$style="width: 100%;"
						textarea
					>
						<svelte:fragment slot="helper">
							<HelperText>
								Describe your bot, what it does, and what makes it unique. You can use MarkDown for
								this!
							</HelperText>
						</svelte:fragment>
					</TextField>
				</div>

				<!-- Bot Tags -->
				<div class="mb-2">
					<!-- Label -->
					<Label>Bot Tags</Label>
					<Set chips={data?.allBotTags} let:chip filter bind:selected={formData.tags}>
						<Chip {chip} touch>
							<Text>{chip.name}</Text>
						</Chip>
					</Set>
				</div>

				<!-- Nsfw button -->
				<div class="mb-2">
					<FormField>
						<Switch bind:checked={formData.isNSFW} />
						<span slot="label">This bot contains NSFW</span>
					</FormField>
				</div>

				<!-- Actions -->
				<div>
					<Button type="submit" variant="outlined" color="primary">Submit</Button>
					<Button
						color="primary"
						type="button"
						on:click={() => {
							goto(`/users/${data?.actor?.id}`);
						}}>Cancel</Button
					>
					<Button
						color="primary"
						type="button"
						on:click={() => {
							goto(data?.guildInvite);
						}}>Discord Server</Button
					>
				</div>
			</form>
		</Content>
	</Paper>
</div>

<style>
	.botbutton-username {
		text-transform: none !important;
		margin-left: 6px;
	}

	.botbutton-avatar {
		height: 30px;
		width: 30px;
		border-radius: 10px;
		object-fit: contain;
	}

	.paper-container {
		padding: 24px;
	}

	.mb-2 {
		margin-bottom: 16px;
	}
</style>
