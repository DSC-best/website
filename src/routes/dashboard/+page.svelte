<script lang="ts">
	import Card, { Content, PrimaryAction, Actions, ActionButtons, ActionIcons } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import type { Bot } from '@prisma/client';
	import Dialog, { Title, Header } from '@smui/dialog';
	import TextField from '@smui/textfield';
	import Select, { Option } from '@smui/select';
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';

	let open = false;
	let botSubmission = {
		id: '',
		tagline: '',
		inviteUrl: '',
		tags: [],
		otherOwners: [],
		isNSFW: false
	};

	function handleSubmit() {
		console.log('Bot Submission:', botSubmission);
		open = false;
	}

	export let data;

	const bots: Bot[] = [];
</script>

<Dialog
	bind:open
	fullscreen
	aria-labelledby="fullscreen-title"
	aria-describedby="fullscreen-content"
>
	<Header>
		<Title id="fullscreen-title">Add your bot</Title>
		<IconButton class="material-icons" on:click={() => (open = false)}>close</IconButton>
	</Header>
	<Content id="fullscreen-content">
		<form on:submit|preventDefault={handleSubmit}>
			<TextField label="Bot ID" bind:value={botSubmission.id} required /> <br />
			<TextField label="Tagline" bind:value={botSubmission.tagline} required /> <br />
			<TextField label="Invite URL" bind:value={botSubmission.inviteUrl} /> <br />

			<Select label="Tags" multiple bind:value={botSubmission.tags}>
				<Option value="Fun">Fun</Option>
				<Option value="Utility">Utility</Option>
				<Option value="Music">Music</Option>
			</Select> <br />

			<TextField
				label="Other Owners (User IDs, comma-separated)"
				bind:value={botSubmission.otherOwners}
			/> <br />

			<FormField>
				<Checkbox bind:checked={botSubmission.isNSFW} />
				<span slot="label">Is NSFW?</span>
			</FormField>
			<br />
		</form>
	</Content>
	<Actions>
		<Button on:click={() => (open = false)}>
			<Label>Cancel</Label>
		</Button>
		<Button on:click={handleSubmit}>
			<Label>Submit</Label>
		</Button>
	</Actions>
</Dialog>

<div class="card-container dashboard-card">
	<Card>
		<Content>
			<h2>Your bots ({bots.length})</h2>
			{#if bots.length > 0}
				<ul>
					{#each bots as bot}
						<li>
							<strong>{bot.username}</strong> - {bot.description}
						</li>
					{/each}
				</ul>
			{:else}
				<p>No applications available.</p>
			{/if}
		</Content>
		<Actions>
			<IconButton class="material-icons" on:click={() => (open = true)} title="Add New Bot"
				>add</IconButton
			>
		</Actions>
	</Card>
</div>

<style>
	.dashboard-card {
		margin: 32px;
		border-radius: 16px;
		padding: 16px;
	}
	.jumbotron {
		background-color: #0a1222;
		margin: 32px;
		border-radius: 16px;
		padding: 16px;
	}
</style>
