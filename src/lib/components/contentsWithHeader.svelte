<script lang="ts">
	import Button from '@smui/button';

	export let title: string;
	export let subtitle: string;
	// Right Button
	export let rightButtonTitle: string | undefined = undefined;
	export let rightButtonLink: string | undefined = undefined;
</script>

<div class="card-container contents-with-header">
	<div class="mdc-layout-grid cwh-title">
		<div class="titles">
			<h2 class="text-white">{title}</h2>
			<p>{subtitle}</p>
		</div>
		<div class="right-button">
			{#if rightButtonLink && rightButtonTitle}
				<Button
					variant="outlined"
					color="primary"
					on:click={() => (window.location = rightButtonLink)}
				>
					<span style="text-transform: none;">
						{rightButtonTitle}
					</span>
				</Button>
			{/if}
		</div>
	</div>

	<slot />
</div>

<style>
	.cwh-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0 !important;
		padding-bottom: 0 !important;
	}

	.titles {
		display: flex;
		flex-direction: column;
	}

	.right-button {
		display: flex;
		align-items: center;
	}
</style>
