<script lang="ts">
	import type { User } from '@prisma/client';
	import { goto } from '$app/navigation';
	import Button from '@smui/button';

	export let user: User;
</script>

<Button class="userbutton" on:click={() => goto(`/users/${user?.id}`)}>
	{#if user}
		<img src={user?.avatar} alt="Avatar" class="userbutton-avatar" />
	{:else}
		<span class="material-icons">account_circle</span>
	{/if}
	<span class="userbutton-username">{user?.username ?? 'Unknown'}</span>
</Button>

<style>
	.userbutton-username {
		text-transform: none !important;
		margin-left: 6px;
	}

	.userbutton-avatar {
		height: 30px;
		width: 30px;
		border-radius: 50%;
		object-fit: contain;
	}
</style>
