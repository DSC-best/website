<script lang="ts">
	import { goto } from '$app/navigation';
	import type { IBotTag } from '$lib/server/botTags';
	import Chip, { Set, Text } from '@smui/chips';

	export let tags: IBotTag[] = [];
</script>

<Set chips={tags} let:chip>
	<Chip on:click={() => goto(`/tags/${chip.id}`)} style="cursor:pointer;" {chip}>
		{#if chip?.materialIcon}
			<span class="material-icons" style="margin-right: 5px; font-size: 18px;">
				{chip?.materialIcon}
			</span>
		{/if}
		<Text>{chip.name}</Text>
	</Chip>
</Set>
