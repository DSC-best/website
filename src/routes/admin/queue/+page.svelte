<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import LinearProgress from '@smui/linear-progress';
	import Button from '@smui/button';
	import axios from 'axios';
	import { goto } from '$app/navigation';

	export let data;

	let errorMessage: string = '';

	let tableLoaded = true;

	function reviewBot(uid: string) {
		tableLoaded = false;

		axios
			.post(`/api/v1/bots/${uid}/claim`)
			.then((d) => {
				goto(`/bots/${uid}`);
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
		<Title>Approval Queue</Title>
		<Subtitle>
			{data?.pendingBotsCount ?? 0} bots in queue. You can only approve one bot at a time, and will be
			forced to finish the approval process before claiming another bot.
		</Subtitle>
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

			<DataTable table$aria-label="People list" style="max-width: 100%;">
				<Head>
					<Row>
						<Cell>Avatar</Cell>
						<Cell>Name</Cell>
						<Cell>NSFW</Cell>
						<Cell>Action</Cell>
					</Row>
				</Head>
				<Body>
					{#each data?.pendingBots as bot}
						<Row>
							<Cell>
								<img src={bot?.avatar} alt="Avatar" class="bot-avatar" />
							</Cell>
							<Cell>{bot?.username}</Cell>
							<Cell>{bot?.nsfw ? 'Contains NSFW' : 'Not NSFW'}</Cell>
							<Cell>
								<Button
									variant="outlined"
									disabled={!tableLoaded}
									on:click={() => {
										reviewBot(bot?.id);
									}}
								>
									Review
								</Button>
							</Cell>
						</Row>
					{/each}
					<!-- no data -->
					{#if data?.pendingBots.length === 0}
						<Row>
							<Cell colspan={3}>No bots in queue.</Cell>
						</Row>
					{/if}
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
	.paper-container {
		padding: 24px;
	}

	.bot-avatar {
		width: 30px;
		height: 30px;
		border-radius: 10px;
	}

	.mb-2 {
		margin-bottom: 16px;
	}
</style>
