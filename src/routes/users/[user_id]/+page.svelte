<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotGrid from '$lib/components/cards/botGrid.svelte';
	import ContentsWithHeader from '$lib/components/contentsWithHeader.svelte';
	import Chip, { Set, Text } from '@smui/chips';
	import Dialog, { Title as DTitle, Content as DContent, Actions as DActions } from '@smui/dialog';
	import Paper, { Content, Title } from '@smui/paper';
	import Button from '@smui/button';
	import MetaTags from '$lib/components/metaTags.svelte';
	import { goto } from '$app/navigation';
	import LayoutGrid from '@smui/layout-grid';
	import { Cell } from '@smui/layout-grid';

	let roleModalOpen = false;
	let roleModalTitle = 'User Role';
	let roleModalContent = 'Placeholder content';
</script>

<MetaTags
	title={`@${data?.user?.username} - DSC.best`}
	description={`Find the best Discord bots listed by @${data?.user?.username} on DSC.best`}
	themeColor={data?.user?.banner_color}
	image={data?.user?.avatar}
/>

<Dialog scrimClickAction="" escapeKeyAction="" open={roleModalOpen}>
	<DTitle>
		{roleModalTitle}
	</DTitle>
	<DContent>
		<div style="padding-top: 10px; padding-bottom: 10px;">
			<p>
				{roleModalContent}
			</p>
		</div>
	</DContent>
	<DActions>
		<Button
			variant="outlined"
			on:click={() => {
				roleModalOpen = false;
			}}
		>
			Cool!
		</Button>
	</DActions>
</Dialog>

<!-- User Display -->
<div>
	<div class="user-display" style={`background-color: ${data?.user?.banner_color};`}>
		<div
			class={`user-display-content ${
				data?.user?.banner_color ? 'user-display-content--banner' : ''
			}`}
		>
			<div class="user-display-avatar">
				<img src={data?.user?.avatar} alt="Avatar" />
			</div>
			<div class="user-display-info">
				<h2 class="user-display-username">{data?.user?.username}</h2>
				<Set chips={data?.userBadges} let:chip>
					<Chip
						{chip}
						on:click={() => {
							roleModalOpen = true;
							roleModalTitle = chip.label;
							roleModalContent = chip.description;
						}}
					>
						{#if chip?.materialIcon}
							<span class="material-icons" style="margin-right: 5px; font-size: 18px;">
								{chip?.materialIcon}
							</span>
						{/if}
						<Text>{chip.label}</Text>
					</Chip>
				</Set>
			</div>
		</div>
	</div>
</div>

{#if data.isModerator}
	<LayoutGrid>
		<Cell span={12}>
			<Paper variant="outlined">
				<Title>Moderation</Title>
				<Content>
					<p>Head over to the moderation page for admin specific actions.</p>
					<Button
						color="primary"
						type="button"
						variant="outlined"
						on:click={() => {
							goto(`/admin/users/${data?.user?.id}`);
						}}
					>
						Moderation Page
					</Button>
				</Content>
			</Paper>
		</Cell>
		{#if data.user.banned}
			<Cell span={12}>
				<Paper color="primary" class="paper-theme--outline-danger">
					<Content>
						<strong>Page Banned:</strong> This page was banned by staff and is only visible to staff.
					</Content>
				</Paper>
			</Cell>
		{/if}
	</LayoutGrid>
{/if}

<ContentsWithHeader
	title="Listed Bots"
	subtitle="Bots listed by this user"
	rightButtonTitle="Submit a Bot"
	rightButtonLink="/submit/bot"
>
	<BotGrid bots={data.userBots} />
</ContentsWithHeader>

<style>
	.user-display-content {
		display: flex;
		flex-direction: row;
		padding: 20px;
		padding-top: 40px;
		padding-bottom: 40px;
		margin-bottom: 20px;
	}

	.user-display-content--banner {
		background-color: rgba(0, 0, 0, 0.3);
	}

	.user-display-avatar {
		width: 80px;
		height: 80px;
		min-width: 80px;
		min-height: 80px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.user-display-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.user-display-info {
		/* align center vertically */
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.user-display-username {
		margin-left: 10px;
		color: #fff;
	}
</style>
