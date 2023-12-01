<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotBadges from '$lib/components/botBadges.svelte';
	import Banner, { Label } from '@smui/banner';
	import Button from '@smui/button';
	import SvelteMarkdown from 'svelte-markdown';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Paper, { Content, Title } from '@smui/paper';
	import UserButton from '$lib/components/userButton.svelte';
	import { goto } from '$app/navigation';
	import { dateFormatEurope } from '$lib/utils/date';
	import TagList from '$lib/components/tagList.svelte';
	import TextField from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Dialog, { Title as DTitle, Content as DContent, Actions as DActions } from '@smui/dialog';
	import axios from 'axios';

	let bannerColor = data?.bot?.banner_color;

	let approverBannerOpen = false;
	let modalApprovalVersion = false;
	let approverModalOpen = false;
	let approverNote = '';
	let approvalErrorMessage = '';
	let isHandlingApproval = false;
	let isResubmitting = false;
	let resubmitErrorMessage = '';

	if (data?.isPendingAndActorIsApprover) {
		approverBannerOpen = true;
	}

	function handleApproval() {
		approverModalOpen = false;
		isHandlingApproval = true;
		approvalErrorMessage = '';
		axios
			.post(`/api/v1/bots/${data.bot.id}/${modalApprovalVersion ? 'approve' : 'reject'}`, {
				note: approverNote
			})
			.then((d) => {
				// reload page
				location.reload();
			})
			.catch((e) => {
				approvalErrorMessage = e?.response?.data?.message;
				approverModalOpen = true;
			})
			.finally(() => {
				isHandlingApproval = false;
			});
	}

	function resubmitBot() {
		resubmitErrorMessage = '';
		isResubmitting = true;
		axios
			.post(`/api/v1/bots/${data.bot.id}/resubmit`)
			.then((d) => {
				location.reload();
			})
			.catch((e) => {
				resubmitErrorMessage = e?.response?.data?.message;
			})
			.finally(() => {
				isResubmitting = false;
			});
	}
</script>

<Banner
	open={approverBannerOpen}
	fixed
	mobileStacked
	autoClose={false}
	centered
	content$style="max-width: max-content;"
>
	<Label slot="label">
		<b> Hey Approver! </b>
		<br />
		This bot is pending approval and requires your approval to be listed on the site
	</Label>
	<div slot="actions">
		<Button
			variant="outlined"
			on:click={() => {
				modalApprovalVersion = true;
				approverModalOpen = true;
			}}>Approve</Button
		>
		<Button
			on:click={() => {
				modalApprovalVersion = false;
				approverModalOpen = true;
			}}>Reject</Button
		>
	</div>
</Banner>

<Dialog scrimClickAction="" escapeKeyAction="" open={approverModalOpen}>
	<DTitle>
		{modalApprovalVersion ? 'Approve Bot' : 'Reject Bot'}
	</DTitle>
	<DContent>
		<div style="padding-top: 10px; padding-bottom: 10px;">
			<p style="margin-bottom: 15px;">
				Before you can {modalApprovalVersion ? 'approve' : 'reject'} this bot, you must provide a note
				and invite the bot to the server.
				<br />
				<br />
				Invite Link:
				<a href={data?.bot?.invite} target="_blank" rel="noopener noreferrer">
					{data?.bot?.invite}
				</a>
			</p>

			<TextField
				variant="outlined"
				label={modalApprovalVersion ? 'Approval Note' : 'Rejection Note'}
				bind:value={approverNote}
				required
				style="width: 100%;"
				helperLine$style="width: 100%;"
				textarea
				disabled={isHandlingApproval}
			>
				<svelte:fragment slot="helper">
					<HelperText>
						{modalApprovalVersion
							? 'Why are you approving this bot?'
							: 'Why are you rejecting this bot?'} This note will be publicly visible.
					</HelperText>
				</svelte:fragment>
			</TextField>

			{#if approvalErrorMessage}
				<Paper
					color="primary"
					class="paper-theme--outline-danger"
					style="margin-top: 10px; padding: 10px;"
				>
					<Content>
						{approvalErrorMessage}
					</Content>
				</Paper>
			{/if}
		</div>
	</DContent>
	<DActions>
		<Button
			variant="outlined"
			on:click={() => {
				handleApproval();
			}}
		>
			{modalApprovalVersion ? 'Approve' : 'Reject'}
		</Button>
		<Button
			on:click={() => {
				approverModalOpen = false;
				approverBannerOpen = true;
			}}
		>
			Cancel
		</Button>
	</DActions>
</Dialog>

<!-- User Display -->
<div class="bot-banner">
	<div class="bot-display" style={`background-color: ${bannerColor};`}>
		<div class={`${bannerColor ? 'bot-display-content--banner' : ''}`}>
			<div class={`bot-display-content`}>
				<div class="bot-display-avatar">
					<img src={data?.bot?.avatar} alt="Avatar" />
				</div>
				<div class="bot-display-info">
					<h2 class="bot-display-username">{data?.bot?.username}</h2>
					<p class="bot-display-info-item bot-tagline">
						{data?.bot?.tagline}
					</p>
					<BotBadges bot={data?.bot} className="bot-display-info-item" />
				</div>
			</div>
		</div>
	</div>
</div>

<div class="bot-about">
	<LayoutGrid>
		<Cell span={3}>
			<div class="stats">
				<Paper>
					<Title>Stats</Title>
					<Content>
						<p>
							{data?.bot?.vote_count || 0} votes
							<br />
							{data?.bot?.guild_count || 0} servers
							<br />
							Added on {dateFormatEurope(data?.bot?.created_at)}
							{#if data?.bot?.approved_time}
								<br />
								Approved on {dateFormatEurope(data?.bot?.approved_time)}
							{/if}
							<br />
							Owned By:
							<UserButton user={data?.bot?.owner} />
						</p>
						{#if data?.bot?.owner_id === data?.actor?.id}
							<div style="margin-top: 10px;">
								<Button
									color="primary"
									type="button"
									variant="outlined"
									on:click={() => {
										goto(`/bots/${data?.bot?.id}/edit`);
									}}>Bot Settings</Button
								>
								{#if data?.canResubmit}
									<Button
										color="primary"
										type="button"
										variant="outlined"
										disabled={isResubmitting}
										on:click={resubmitBot}>Resubmit Bot</Button
									>
									{#if resubmitErrorMessage}
										<Paper
											color="primary"
											class="paper-theme--outline-danger"
											style="margin-top: 10px; padding: 10px;"
										>
											<Content>
												{resubmitErrorMessage}
											</Content>
										</Paper>
									{/if}
								{/if}
							</div>
						{/if}
					</Content>
				</Paper>
			</div>
			<div class="tags" style="margin-top: 20px;">
				<Paper>
					<Title>Tags</Title>
					<Content>
						<TagList tags={data?.botTags} />
					</Content>
				</Paper>
			</div>
		</Cell>
		<Cell span={7}>
			<div class="description">
				<Paper>
					<Content>
						<SvelteMarkdown source={data?.bot?.description} />
					</Content>
				</Paper>
			</div>
		</Cell>
	</LayoutGrid>
</div>

<style>
	.bot-banner {
		margin-bottom: 10px;
	}

	.bot-tagline {
		color: #fff;
	}

	.bot-display-content {
		display: flex;
		flex-direction: row;
		padding: 20px;
		padding-top: 40px;
		padding-bottom: 40px;
	}

	.bot-display-content--banner {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.bot-display-avatar {
		width: 80px;
		height: 80px;
		border-radius: 15px;
		background-color: rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.bot-display-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bot-display-info {
		/* align center vertically */
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.bot-display-username {
		margin-left: 10px;
		color: #fff;
	}
</style>
