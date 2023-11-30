<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotSearchBar from '$lib/components/botSearchBar.svelte';
	import BotGrid from '$lib/components/cards/botGrid.svelte';
	import ContentsWithHeader from '$lib/components/contentsWithHeader.svelte';
	import TagList from '$lib/components/tagList.svelte';
</script>

<div class="mdc-layout-grid" style="margin-top: 20px; margin-bottom: 20px;">
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
