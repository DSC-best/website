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
	import Fab, { Label as FabLabel, Icon } from '@smui/fab';
	import Dialog, { Title as DTitle, Content as DContent, Actions as DActions } from '@smui/dialog';
	import moment from 'moment';
	import axios from 'axios';
	import MetaTags from '$lib/components/metaTags.svelte';

	let bannerColor = data?.bot?.banner_color;

	let approverBannerOpen = false;
	let modalApprovalVersion = false;
	let approverModalOpen = false;
	let approverNote = '';
	let approvalErrorMessage = '';
	let isHandlingApproval = false;
	let isResubmitting = false;
	let resubmitErrorMessage = '';
	let showRecentlyApprovedPaper = false;

	// Deletion modal
	let deletionModalOpen = false;
	let isDeletingBot = false;
	let deletionConfirmationName = '';

	function confirmDeleteBot() {
		isDeletingBot = true;
		deletionModalOpen = false;
		axios
			.delete(`/api/v1/bots/${data.bot.id}`)
			.then((d) => {
				goto(`/`);
			})
			.catch((e) => {
				alert(e?.response?.data?.message ?? 'Unable to send request.');
				deletionModalOpen = true;
			})
			.finally(() => {
				isDeletingBot = false;
			});
	}

	if (data?.bot?.approved_time) {
		const approvedTime = moment(data?.bot?.approved_time);
		const now = moment();
		const diff = now.diff(approvedTime, 'days');
		if (diff < 7) {
			showRecentlyApprovedPaper = true;
		}
	}

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

<MetaTags
	title={`@${data?.bot?.username} - DSC.best`}
	description={data?.bot?.tagline}
	themeColor={data?.bot?.banner_color}
	image={data?.bot?.avatar}
/>

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

<Dialog scrimClickAction="" escapeKeyAction="" open={deletionModalOpen}>
	<DTitle>Delete Bot</DTitle>
	<DContent>
		<div>
			<p style="margin-bottom: 15px;">
				Confirm this by typing the bot's name: <b>{data?.bot?.username}</b>
			</p>

			<TextField
				variant="outlined"
				label={'Confirm Name'}
				bind:value={deletionConfirmationName}
				required
				style="width: 100%;"
				helperLine$style="width: 100%;"
			>
				<svelte:fragment slot="helper">
					<HelperText>Confirm the bot's name to delete it.</HelperText>
				</svelte:fragment>
			</TextField>

			{#if deletionConfirmationName !== data?.bot?.username}
				<p class="text-danger" style="margin-top: 10px;">
					You must type the bot's name exactly to delete it.
				</p>
			{/if}
		</div>
	</DContent>
	<DActions>
		<Button
			variant="outlined"
			disabled={deletionConfirmationName !== data?.bot?.username || isDeletingBot}
			on:click={() => {
				confirmDeleteBot();
			}}
		>
			Delete
		</Button>
		<Button
			on:click={() => {
				deletionModalOpen = false;
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
			<div class="display-between-for-actions">
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
				<div class="actions">
					<Fab
						on:click={() => {
							goto(`/bots/${data?.bot?.id}/invite`);
						}}
						color="primary"
						extended
					>
						<Icon class="material-icons">add</Icon>
						<FabLabel>Invite</FabLabel>
					</Fab>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="bot-about">
	<LayoutGrid>
		{#if data.isModerator}
			<Cell span={12}>
				<Paper variant="outlined">
					<Title>Moderation</Title>
					<Content>
						<p>
							Head over to the moderation page for admin specific actions.
						</p>
						<Button
							color="primary"
							type="button"
							variant="outlined"
							on:click={() => {
								goto(`/admin/bots/${data?.bot?.id}`);
							}}
						>
							Moderation Page
						</Button>
					</Content>
				</Paper>
			</Cell>
		{/if}
		{#if showRecentlyApprovedPaper}
			<Cell span={12}>
				<Paper variant="outlined" color="success" class="paper-theme--outline-success text-success">
					<Title>🐣</Title>
					<Content>I recently got approved and am now listed on DSC.best!</Content>
				</Paper>
			</Cell>
		{/if}
		<Cell
			spanDevices={{
				desktop: 3,
				// full width on mobile
				phone: 12,
				tablet: 12
			}}
		>
			<div class="stats">
				<Paper>
					<Title>Stats</Title>
					<Content>
						<p>
							{data?.bot?.vote_count || 0} votes
							<br />
							{data?.bot?.guild_count || 0} servers
							<br />
							Added on
							<span class="text-muted">
								{dateFormatEurope(data?.bot?.created_at)}
							</span>
							{#if data?.bot?.approved_time}
								<br />
								Approved on
								<span class="text-muted">
									{dateFormatEurope(data?.bot?.approved_time)}
								</span>
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
								<Button
									color="primary"
									type="button"
									on:click={() => {
										deletionModalOpen = true;
									}}
								>
									Delete Bot
								</Button>
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
		<Cell
			spanDevices={{
				desktop: 9,
				// full width on mobile
				phone: 12,
				tablet: 12
			}}
		>
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

	.display-between-for-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.display-between-for-actions .actions {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		padding: 20px;
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
		/* overflow: hidden; */
		position: relative;
	}

	.bot-display-avatar img {
		width: 80px;
		height: 80px;
		min-width: 80px;
		min-height: 80px;
		background-color: rgba(0, 0, 0, 0.2);
		object-fit: cover;
		border-radius: 15px;
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
