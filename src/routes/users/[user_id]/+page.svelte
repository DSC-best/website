<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotGrid from '$lib/components/cards/botGrid.svelte';
	import ContentsWithHeader from '$lib/components/contentsWithHeader.svelte';
	import Chip, { Set, Text } from '@smui/chips';
</script>

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
					<Chip {chip}>
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
