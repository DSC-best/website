<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Paper, { Title, Content } from '@smui/paper';
	import LinearProgress from '@smui/linear-progress';
	import Button from '@smui/button';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import BotBadges from '$lib/components/botBadges.svelte';
	import { BotApprovalStatus } from '@prisma/client';
	import UserButton from '$lib/components/userButton.svelte';
	import { dateFormatEurope } from '$lib/utils/date.js';
	import moment from 'moment';

	export let data;

	$: bot = (data as any)?.bot as any; // weird bug lol

	let errorMessage: string = '';

	let tableLoaded = true;

	function toggleVerified() {
		tableLoaded = false;

		axios
			.post(`/api/v1/bots/${bot?.id}/verified`)
			.then((d: any) => {
				bot['verified'] = d.data?.['verified'];
			})
			.catch((e) => {
				errorMessage = e?.response?.data?.message ?? 'Unable to send request.';
			})
			.finally(() => {
				tableLoaded = true;
			});
	}

	function toggleNSFW() {
		tableLoaded = false;

		axios
			.post(`/api/v1/bots/${bot?.id}/nsfw`)
			.then((d) => {
				bot['nsfw'] = d.data?.['nsfw'];
			})
			.catch((e) => {
				errorMessage = e?.response?.data?.message ?? 'Unable to send request.';
			})
			.finally(() => {
				tableLoaded = true;
			});
	}

	function forceReject() {
		tableLoaded = false;

		axios
			.post(`/api/v1/bots/${bot?.id}/force-reject`)
			.then((d: any) => {
				bot['approval_status'] = d.data?.['approval_status'];
			})
			.catch((e) => {
				errorMessage = e?.response?.data?.message ?? 'Unable to send request.';
			})
			.finally(() => {
				tableLoaded = true;
			});
	}

	function toggleBan() {
		tableLoaded = false;

		axios
			.post(`/api/v1/bots/${bot?.id}/ban`)
			.then((d: any) => {
				bot['approval_status'] = d.data?.['approval_status'];
			})
			.catch((e) => {
				errorMessage = e?.response?.data?.message ?? 'Unable to send request.';
			})
			.finally(() => {
				tableLoaded = true;
			});
	}
</script>

<div class="paper-container align-flex-center">
	<Paper class="paper">
		<Title>Bot Admin</Title>
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
				<img src={bot?.avatar} alt="Avatar" class="bot-avatar" />
				<div class="bot-display-contents">
					<h4>{bot?.username}</h4>
					<BotBadges {bot} />
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
						<Cell>{bot?.id}</Cell>
						<Cell>
							<Button
								variant="outlined"
								disabled={!tableLoaded}
								on:click={() => {
									goto(`/bots/${bot?.id}`);
								}}
							>
								View Bot
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Username</Cell>
						<Cell>{bot?.username}</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>Owner</Cell>
						<Cell>
							<UserButton user={bot?.owner} />
						</Cell>
						<Cell>
							<Button
								variant="outlined"
								disabled={!tableLoaded}
								on:click={() => {
									goto(`/admin/users/${bot?.owner?.id}`);
								}}
							>
								Admin View
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Approver</Cell>
						<Cell>
							{#if bot?.approver === null}
								Not approved yet.
							{:else}
								<UserButton user={bot?.approver} />
							{/if}
						</Cell>
						<Cell>
							{#if bot?.approver !== null}
								<Button
									variant="outlined"
									disabled={!tableLoaded}
									on:click={() => {
										goto(`/admin/users/${bot?.approver?.id}`);
									}}
								>
									Admin View
								</Button>
							{/if}
						</Cell>
					</Row>
					<Row>
						<Cell>Vote Count</Cell>
						<Cell>{bot?.vote_count}</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>Created Time</Cell>
						<Cell>
							{dateFormatEurope(bot?.created_time)} ({moment(bot?.created_time).fromNow()})
						</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>Approval Req. Time</Cell>
						<Cell>
							{dateFormatEurope(bot?.approval_request_time)} ({moment(
								bot?.approval_request_time
							).fromNow()})
						</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>Approved Time</Cell>
						<Cell>
							{#if bot?.approved_time === null}
								Not approved yet.
							{:else}
								{dateFormatEurope(bot?.approved_time)} ({moment(bot?.approved_time).fromNow()})
							{/if}
						</Cell>
						<Cell></Cell>
					</Row>
					<Row>
						<Cell>NSFW</Cell>
						<Cell>{bot?.nsfw}</Cell>
						<Cell>
							<Button variant="outlined" disabled={!tableLoaded} on:click={toggleNSFW}>
								{bot?.nsfw ? 'Unset NSFW' : 'Set NSFW'}
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Verified</Cell>
						<Cell>{bot?.verified}</Cell>
						<Cell>
							<Button variant="outlined" disabled={!tableLoaded} on:click={toggleVerified}>
								{bot?.verified ? 'Unverify' : 'Verify'}
							</Button>
						</Cell>
					</Row>
					<Row>
						<Cell>Approval Status</Cell>
						<Cell>{bot?.approval_status}</Cell>
						<Cell>
							{#if bot?.approval_status === BotApprovalStatus.APPROVED}
								<Button variant="outlined" disabled={!tableLoaded} on:click={forceReject}>
									Force Reject
								</Button>
								<Button variant="outlined" disabled={!tableLoaded} on:click={toggleBan}>Ban</Button>
							{/if}
							{#if bot?.approval_status === BotApprovalStatus.BANNED}
								<Button variant="outlined" disabled={!tableLoaded} on:click={toggleBan}>
									Unban
								</Button>
							{/if}
						</Cell>
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
		border-radius: 10px;
	}

	.mb-2 {
		margin-bottom: 16px;
	}
</style>
