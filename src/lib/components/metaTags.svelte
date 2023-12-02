<script lang="ts">
	export let title: string;
	export let description: string;
	export let themeColor: string = '#454FBF';
	export let image: string = '/logo.png';
</script>

<svelte:head>
	<meta name="theme-color" content={themeColor} />
	<meta name="og:title" content={title} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />

	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	<meta name="og:image" content={image} />
</svelte:head>
