<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data: any;
</script>

<Header actor={data.actor} />
<slot />
<Footer />
