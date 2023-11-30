<script lang="ts">
	import type { Bot } from '@prisma/client';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import BotCard from './botCard.svelte';

	export let bots: Bot[];
</script>

{#if bots.length === 0}
	<!-- No Bots available -->
	<div class="mdc-layout-grid">
		<p class="text-muted">No bots available.</p>
	</div>
{:else}
	<LayoutGrid>
		{#each bots as bot}
			<Cell>
				<BotCard {bot} />
			</Cell>
		{/each}
	</LayoutGrid>
{/if}
