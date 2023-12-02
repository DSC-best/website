<script lang="ts">
	import type { Bot } from '@prisma/client';
	import Card, { Content, Actions } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import BotBadges from '../botBadges.svelte';
	import { goto } from '$app/navigation';

	export let bot: Bot;
</script>

<Card>
	<Content>
		<div class="card">
			<div class="top-data">
				<img src={bot?.avatar || '/logo.png'} class="card-img-top" alt="Avatar" />
				<div class="bot-info">
					<h2 class="bot-username text-white">
						{bot?.username || 'Unknown'}
					</h2>
					<p class="bot-info-item">
						{bot?.vote_count || 0} votes
						{' • '}
						{bot?.guild_count || 0} servers
					</p>
					<BotBadges {bot} />
				</div>
			</div>
			<div class="card-body">
				<p class="bot-tagline">
					{bot?.tagline || 'No Tagline'}
				</p>
			</div>
			<div class="card-footer">
				<Actions style="padding: 0;">
					<Button
						variant="outlined"
						on:click={() => {
							goto(`/bots/${bot?.slug || bot?.id}`);
						}}
					>
						<Label>View</Label>
					</Button>
					<Button
						on:click={() => {
							goto(`/bots/${bot?.id}/invite`);
						}}
					>
						<Label>Invite</Label>
					</Button>
				</Actions>
			</div>
		</div>
	</Content>
</Card>

<style>
	.card-img-top {
		height: 80px;
		width: 80px;
		border-radius: 5px;
		background-color: rgba(0, 0, 0, 0.2);
		object-fit: cover;
	}

	.card-body {
		margin: 13px 0;
	}

	.card-footer {
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0px 6px;
		border-radius: 5px;
		background-color: var(--mdc-theme-background);
	}

	.top-data {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.bot-info {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		overflow: hidden;
	}

	.bot-username {
		overflow: hidden;
		font-size: large;
		text-overflow: ellipsis;
		padding-bottom: 5px;
	}

	.bot-info-item:not(:last-child) {
		overflow: hidden;
		text-overflow: ellipsis;
		padding-bottom: 5px;
	}

	.bot-tagline {
		/* auto line break */
		word-wrap: break-word;
	}
</style>
