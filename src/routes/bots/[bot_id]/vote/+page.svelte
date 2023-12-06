<script lang="ts">
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import Button from '@smui/button';
	import { goto } from '$app/navigation';
	import moment from 'moment';
	import axios from 'axios';
	import MetaTags from '$lib/components/metaTags.svelte';

	export let data;

	let loading = false;

	let errorMessage: string = '';

	if (data?.votingDisabled) {
		errorMessage = 'Voting is currently disabled for this bot.';
	}

	if(!data?.actor){
		errorMessage = 'You must be logged in to vote for a bot.';
	}

	function onVote() {
		loading = true;

		axios
			.post(`/api/v1/bots/${data?.bot?.id}/vote`)
			.then((d) => {
				goto(`/bots/${data?.bot?.id}`);
			})
			.catch((e) => {
				errorMessage = e?.response?.data?.message ?? 'Unable to send request.';
			})
			.finally(() => {
				loading = false;
			});
	}
</script>

<MetaTags
	title={`Vote for @${data?.bot?.username} - DSC.best`}
	description={`Vote for @${data?.bot?.username}, it currently has ${data?.bot?.vote_count} votes!`}
	themeColor={data?.bot?.banner_color ?? '#000000'}
	image={data?.bot?.avatar}
/>

<div class="paper-container align-flex-center">
	<Paper class="paper">
		<Title>Vote for bot!</Title>
		<Subtitle>You can only vote for a bot once every 12 hours.</Subtitle>
		<Content>
			{#if errorMessage}
				<div class="mb-2">
					<Paper color="primary" style="padding: 10px;" class="paper-theme--outline-danger">
						<Content>
							{errorMessage}
						</Content>
					</Paper>
				</div>
			{/if}

			<div class="mb-2">
				<div class="bot-preview">
					<img class="bot-avatar" src={data?.bot?.avatar} alt="" />
					<div class="bot-items">
						<p>
							<b>{data?.bot?.username}</b>
						</p>
						<p>
							{data?.bot?.vote_count} votes
						</p>
					</div>
				</div>
			</div>

			{#if !data.canVote}
				<p class="text-danger mb-2">
					You can vote again {moment(data?.newVoteTime).fromNow()}
				</p>
			{/if}

			<!-- Actions -->
			<div>
				<Button
					disabled={!data?.canVote || data?.votingDisabled || loading || !data?.actor}
					variant="outlined"
					color="primary"
					on:click={onVote}
				>
					{loading ? 'Loading...' : 'Vote'}
				</Button>
				<Button
					color="primary"
					type="button"
					on:click={() => {
						goto(`/bots/${data?.bot?.id}`);
					}}
				>
					Cancel
				</Button>
			</div>
		</Content>
	</Paper>
</div>

<style>
	.bot-preview {
		display: flex;
		align-items: center;
		background-color: var(--mdc-theme-background);
		padding: 10px;
		border-radius: 4px;
	}

	.bot-preview .bot-items {
		margin-left: 10px;
	}

	.paper-container {
		padding: 24px;
	}

	.bot-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.mb-2 {
		margin-bottom: 16px;
	}
</style>
