<script lang="ts">
	import { goto } from '$app/navigation';

	/** @type {import('./$types').LayoutData} */
	/** @type {import('./$types').PageData} */
	export let data: any;

	import BotSearchBar from '$lib/components/botSearchBar.svelte';
	import BotGrid from '$lib/components/cards/botGrid.svelte';
	import ContentsWithHeader from '$lib/components/contentsWithHeader.svelte';
	import TagList from '$lib/components/tagList.svelte';
	import Fab from '@smui/fab';
	import { Icon } from '@smui/common';

	const paginate = (increment: boolean) => {
		let newPage = data.page + (increment ? 1 : -1);

		goto(`/bots/search?q=${data.query}&page=${newPage}`);
	};
</script>

<div class="mdc-layout-grid" style="margin-top: 20px; margin-bottom: 20px;">
	<BotSearchBar value={data.query || ""} />
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

<ContentsWithHeader title="Search Results" subtitle="Sorted by highest rated">
	<BotGrid bots={data.results} />
	<div class="mdc-layout-grid" style="padding-top: 10px;">
		{#if data.page > 1}
			<Fab on:click={() => paginate(false)} color="primary" mini class="solo-fab">
				<Icon class="material-icons">arrow_back</Icon>
			</Fab>
		{/if}
		{#if data.results.length === data.limit}
			<Fab on:click={() => paginate(true)} color="primary" mini class="solo-fab">
				<Icon class="material-icons">arrow_forward</Icon>
			</Fab>
		{/if}
	</div>
</ContentsWithHeader>
