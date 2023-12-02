<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data: any;
</script>

<svelte:head>
	<title>DSC.best</title>
	<meta name="theme-color" content="#454FBF">
	<meta name="description" content="Find the best Discord bots!" />
</svelte:head>

<Header actor={data.actor} />
<slot />
<Footer />
