<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Paper, { Title, Content } from '@smui/paper';
	import LinearProgress from '@smui/linear-progress';
	import Button from '@smui/button';
	import axios from 'axios';
	import type { User } from '@prisma/client';
	import { goto } from '$app/navigation';
	import { dateFormatEurope } from '$lib/utils/date';
	import Dialog, { Title as DTitle, Content as DContent, Actions as DActions } from '@smui/dialog';
	import Chip, { Set, Text } from '@smui/chips';
	import moment from 'moment';

	export let data;

	$: user = data.user as User; // weird bug lol

	let errorMessage: string = '';

	let tableLoaded = true;

	function toggleBan() {
		tableLoaded = false;

		axios
			.post(`/api/v1/users/${user.id}/ban`, {
				banned: !user.banned
			})
			.then((res) => {
				user['banned'] = res.data.banned;
				user['role'] = res.data.role;
			})
			.catch((err) => {
				errorMessage = err.response.data.message;
			})
			.finally(() => {
				tableLoaded = true;
			});
	}

	// Role management
	let selectedRoles = data.allRoles.filter((role) => data.rolesSelected.includes(role.id));
	let roleModalOpen = false;

	function setNewRoles() {
		roleModalOpen = false;

		let newRolesToNumber = selectedRoles.map((role) => role.id);

		axios
			.post(`/api/v1/users/${user.id}/role`, {
				role: newRolesToNumber
			})
			.then((res) => {
				user['role'] = res.data.role;
			})
			.catch((err) => {
				errorMessage = err.response.data.message;
			})
			.finally(() => {
				tableLoaded = true;
			});
	}
</script>

<Dialog scrimClickAction="" escapeKeyAction="" open={roleModalOpen}>
	<DTitle>Modify Roles</DTitle>
	<DContent>
		<div style="padding-top: 10px; padding-bottom: 10px;">
			<p>Select roles for this user:</p>

			<Set
				chips={[...data.allRoles.slice(0, data.allRoles.length - 1)]}
				let:chip
				filter
				bind:selected={selectedRoles}
			>
				<Chip {chip} touch>
					<Text>{chip.label}</Text>
				</Chip>
			</Set>
		</div>
	</DContent>
	<DActions>
		<Button variant="outlined" on:click={setNewRoles}>Done</Button>
		<Button
			on:click={() => {
				roleModalOpen = false;
			}}
		>
			Close
		</Button>
	</DActions>
</Dialog>

<div class="paper-container align-flex-center">
	<Paper class="paper">
		<Title>User Admin</Title>
		<Content>
			{#if errorMessage}
				<div class="mb-2">
					<Paper color="primary" class="paper-theme--outline-danger" style="padding: 10px;">
						<Content>
							{errorMessage}
						</Content>
					</Paper>
				</div>
			{/if}

			<div class="bot-display">
				<img src={user?.avatar} alt="Avatar" class="bot-avatar" />
				<div class="bot-display-contents">
					<h4>{user?.username}</h4>
				</div>
			</div>

			<DataTable table$aria-label="People list" style="max-width: 100%;">
				<Head>
					<Row>
						<Cell>Key</Cell>
						<Cell>Value</Cell>
						<Cell>Action</Cell>
					</Row>
				</Head>
				<Body>
					<Row>
						<Cell>ID</Cell>
						<Cell>{user?.id}</Cell>
						<Cell>
							<Button
								variant="outlined"
								disabled={!tableLoaded}
								on:click={() => {
									goto(`/users/${user?.id}`);
								}}
							>
								View User
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Username</Cell>
						<Cell>{user?.username}</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>Locale</Cell>
						<Cell>{user?.locale}</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>Banned</Cell>
						<Cell>{user?.banned}</Cell>
						<Cell>
							<Button variant="outlined" disabled={!tableLoaded} on:click={toggleBan}>
								{user?.banned ? 'Unban' : 'Ban'}
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Roles</Cell>
						<Cell>
							<span style="margin-right: 3px;" class="badge badge-primary">User</span>
							{#each data?.allRoles as role}
								{#if selectedRoles.includes(role)}
									<span style="margin-right: 3px;" class="badge badge-primary">{role.label}</span>
								{/if}
							{/each}
						</Cell>
						<Cell>
							<Button
								variant="outlined"
								disabled={!tableLoaded}
								on:click={() => {
									roleModalOpen = true;
								}}
							>
								Modify
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Join Time</Cell>
						<Cell>
							{dateFormatEurope(user?.created_time)} ({moment(user?.created_time).fromNow()})
						</Cell>
						<Cell></Cell>
					</Row>
				</Body>

				<LinearProgress
					indeterminate
					bind:closed={tableLoaded}
					aria-label="Data is being loaded..."
					slot="progress"
				/>
			</DataTable>
		</Content>
	</Paper>
</div>

<style>
	.bot-display {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
	}

	.bot-display-contents {
		margin-left: 7px;
	}

	.paper-container {
		padding: 24px;
	}

	.bot-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.mb-2 {
		margin-bottom: 16px;
	}
</style>
