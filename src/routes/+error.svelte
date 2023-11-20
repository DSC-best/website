<script>
	// src/routes/blog/[slug]/+page.svelte

	import { page } from '$app/stores';
</script>

<div style="text-align: center; margin-top: 80px; margin-bottom: 80px;">
	<h1>
		{$page.status}
	</h1>
	<p>
		{$page.error?.message}
	</p>
</div>
