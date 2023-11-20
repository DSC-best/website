<script lang="ts">
	import Menu from '@smui/menu';
	import List, { Item, Separator, Text } from '@smui/list';
	import Button from '@smui/button';
	import IconButton from '@smui/icon-button';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import type { User } from '@prisma/client';
	import { goto } from '$app/navigation';

	export let actor: User | null;
	let menu: Menu;

	function onUserClick() {
		if (!actor) return goto('/api/v1/auth');

		menu.setOpen(true);
	}

	function githubLink() {
		goto('https://github.com/dsc-best/website');
	}

	function viewProfile() {
		goto(`/users/${actor?.id}`);
	}

	function viewDashboard() {
		goto(`/dashboard`);
	}

	function logout() {
		goto('/api/v1/auth/logout');
	}
</script>

<nav class="dsc-navbar">
	<div class="navItems">
		<a href="/" class="logo">
			<img class="logo-img" src="/logo.png" alt="Logo" />
		</a>
		<div class="navLinks">
			<Wrapper>
				<IconButton on:click={githubLink} class="material-icons">code</IconButton>
				<Tooltip style="z-index: 101;">Github Source Code</Tooltip>
			</Wrapper>
		</div>
	</div>

	<div>
		<Button class="nav-user" on:click={onUserClick}>
			{#if actor}
				<img src={actor?.avatar} alt="Avatar" class="nav-user-avatar" />
			{:else}
				<span class="material-icons">account_circle</span>
			{/if}
			<span class="nav-user-name">{(actor?.global_name || actor?.username) ?? 'LOGIN'}</span>
		</Button>
		<Menu bind:this={menu}>
			<List>
				<Item on:SMUI:action={viewProfile}>
					<Text>Profile</Text>
				</Item>
				<Item on:SMUI:action={viewDashboard}>
					<Text>Dashboard</Text>
				</Item>
				<Separator />
				<Item on:SMUI:action={logout}>
					<Text>Logout</Text>
				</Item>
			</List>
		</Menu>
	</div>
</nav>

<style>
	.dsc-navbar {
		padding: 10px;
		padding-left: 15px;
		padding-right: 15px;
		position: sticky;
		top: 0;
		background-color: #0a1222;
		z-index: 100;
	}

	.nav-user-name {
		text-transform: none !important;
		margin-left: 6px;
	}

	/* background when scroll */

	.navItems {
		display: flex;
		align-items: center;
	}

	.navItems .navLinks {
		margin-left: 10px;
	}

	.dsc-navbar {
		/* Display inbetween */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-user-avatar {
		height: 30px;
		width: 30px;
		border-radius: 50%;
		object-fit: contain;
	}

	.logo-img {
		height: 50px;
	}
</style>
