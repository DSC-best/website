<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotGrid from '$lib/components/cards/botGrid.svelte';
	import ContentsWithHeader from '$lib/components/contentsWithHeader.svelte';
</script>

<div
	style="height: 150px; text-align: center; display: flex; align-items: center; justify-content: center; opacity: .04;"
>
	<h3>Hier moet een search bar komen, maar werk ik later wel aan, doe maar alsof het r is</h3>
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
