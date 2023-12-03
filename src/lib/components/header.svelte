<script lang="ts">
	import Menu from '@smui/menu';
	import List, { Item, Separator, Text } from '@smui/list';
	import Button from '@smui/button';
	import IconButton from '@smui/icon-button';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import type { User } from '@prisma/client';
	import { goto } from '$app/navigation';
	import Badge from '@smui-extra/badge';

	export let actor: User | null;
	export let isApprover: boolean;
	export let botQueueCount: number;

	let headerAdminZoneDivider = false;

	// If the user is an approver, we want to show options in a separate section
	if (isApprover) {
		headerAdminZoneDivider = true;
	}

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

	function submitBotPage() {
		goto(`/submit/bot`);
	}

	function logout() {
		goto('/api/v1/auth/logout');
	}

	function viewBotQueue() {
		goto('/admin/queue');
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
			<Wrapper>
				<IconButton on:click={submitBotPage} class="material-icons">add</IconButton>
				<Tooltip style="z-index: 101;">Submit Bot</Tooltip>
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
			<span class="nav-user-name">{actor?.username ?? 'LOGIN'}</span>
		</Button>
		<Menu bind:this={menu}>
			<List>
				<Item on:SMUI:action={viewProfile}>
					<Text>Profile</Text>
				</Item>
				{#if headerAdminZoneDivider}
					<Separator />
				{/if}
				{#if isApprover}
					<Item on:SMUI:action={viewBotQueue} style="position: relative;">
						<Text>Bot Queue</Text>
						{#if botQueueCount > 0}
							<Badge aria-label="Bot Queue Count" position="inset">
								{botQueueCount}
							</Badge>
						{/if}
					</Item>
				{/if}
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
		/* position: sticky; */
		/* top: 0; */
		/* background-color: #0a1222; */
		/* z-index: 100; */
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
