<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotSearchBar from '$lib/components/botSearchBar.svelte';
	import BotGrid from '$lib/components/cards/botGrid.svelte';
	import ContentsWithHeader from '$lib/components/contentsWithHeader.svelte';
	import TagList from '$lib/components/tagList.svelte';
</script>

<div class="banner-home">
	<div class="mdc-layout-grid">
		<div class="align-bars-center">
			<BotSearchBar />
			<div
				style="
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			"
			>
				<TagList tags={data.botTags} />
			</div>
		</div>
	</div>
</div>

<ContentsWithHeader
	title="Top Bots"
	subtitle="Highest rated bots on the list!"
	rightButtonTitle="View All"
	rightButtonLink="/bots/top"
>
	<BotGrid bots={data.topBots} />
</ContentsWithHeader>

<ContentsWithHeader
	title="New Bots"
	subtitle="Check out the latest bots on the list!"
	rightButtonTitle="View All"
	rightButtonLink="/bots"
>
	<BotGrid bots={data.newBots} />
</ContentsWithHeader>

<style>

	.align-bars-center {
		margin-top: 40px;
		margin-bottom: 20px;
	}
</style>
