<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data: any;
</script>

<svelte:head>
	<title>DSC.best</title>
	<meta name="theme-color" content="#454FBF" />
	<meta name="description" content="Find the best Discord bots!" />
</svelte:head>

<div class="app-core">
	<Header actor={data.actor} isApprover={data.isApprover} botQueueCount={data.botQueueCount} />
	<slot />
	<Footer />
</div>

<style>
	.app-core {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
