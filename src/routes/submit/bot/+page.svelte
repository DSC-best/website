<script lang="ts">
	import type { IBotTag } from '$lib/server/botTags';
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

	let errorMessage: string = '';

	let selectedTags: IBotTag[] = [];

	let botSubmission = {
		id: '',
		tagline: '',
		inviteUrl: '',
		description: '',
		bannerColor: '',
		tags: selectedTags,
		isNSFW: false
	};

	function handleSubmit() {
		axios
			.post('', botSubmission)
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
		<Title>Submit your bot!</Title>
		<Subtitle>Your bot will need to be approved before it will be visible on the list</Subtitle>
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

				<!-- Field for bot ID -->
				<div class="mb-2">
					<TextField
						variant="outlined"
						label="Bot ID"
						bind:value={botSubmission.id}
						required
						style="width: 100%;"
						helperLine$style="width: 100%;"
					>
						<svelte:fragment slot="helper">
							<HelperText>The bot you are submitting should be created by you.</HelperText>
						</svelte:fragment>
					</TextField>
				</div>

				<!-- Field for bot tagline -->
				<div class="mb-2">
					<TextField
						label="Tagline"
						bind:value={botSubmission.tagline}
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
						bind:value={botSubmission.inviteUrl}
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
						bind:value={botSubmission.bannerColor}
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
						bind:value={botSubmission.description}
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

				<div class="mb-2">
					<!-- Label -->
					<Label>Bot Tags</Label>
					<Set chips={data?.botTags} let:chip filter bind:selected={selectedTags}>
						<Chip {chip} touch>
							<Text>{chip.name}</Text>
						</Chip>
					</Set>
				</div>

				<div class="mb-2">
					<FormField>
						<Switch bind:checked={botSubmission.isNSFW} />
						<span slot="label">This bot contains NSFW</span>
					</FormField>
				</div>

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
	.paper-container {
		padding: 24px;
	}

	.mb-2 {
		margin-bottom: 16px;
	}
</style>
