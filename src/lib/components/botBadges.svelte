<script lang="ts">
	import type { Bot } from '@prisma/client';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { BotApprovalStatus } from '@prisma/client';
	import moment from 'moment';

	export let bot: Bot;
	export let className: string = '';

	let showRecentlyApprovedBadge = false;

	if (bot?.approved_time) {
		const approvedTime = moment(bot?.approved_time);
		const now = moment();
		const diff = now.diff(approvedTime, 'days');
		if (diff < 7) {
			showRecentlyApprovedBadge = true;
		}
	}
</script>

<div class={`bot-badges ${className}`}>
	{#if bot?.verified}
		<Wrapper>
			<span class="badge badge-success" style="margin-right: 1px;"> Verified </span>
			<Tooltip>This is a verified bot!</Tooltip>
		</Wrapper>
	{/if}
	{#if bot?.nsfw}
		<Wrapper>
			<span class="badge badge-danger" style="margin-right: 1px;">NSFW</span>
			<Tooltip>This bot is not safe for work!</Tooltip>
		</Wrapper>
	{/if}
	{#if showRecentlyApprovedBadge}
		<Wrapper>
			<span class="badge badge-secondary" style="margin-right: 1px;">New!</span>
			<Tooltip>
				This bot was recently approved!
			</Tooltip>
		</Wrapper>
	{/if}
	{#if bot?.approval_status !== BotApprovalStatus.APPROVED && bot?.approval_status !== BotApprovalStatus.PENDING}
		<Wrapper>
			<span class="badge badge-danger" style="margin-right: 1px;">
				{bot?.approval_status}
			</span>
			<Tooltip>This bot is not listed on our site</Tooltip>
		</Wrapper>
	{/if}
	{#if bot?.approval_status === BotApprovalStatus.PENDING}
		<Wrapper>
			<span class="badge badge-primary" style="margin-right: 1px;">
				{bot?.approval_status}
			</span>
			<Tooltip>This bot is pending approval from one of our bot approvers!</Tooltip>
		</Wrapper>
	{/if}
	<Wrapper>
		<span class="badge badge-primary" style="margin-right: 1px;">
			{bot?.vote_count} votes
		</span>
		<Tooltip>
			This bot has {bot?.vote_count} votes!
		</Tooltip>
	</Wrapper>
</div>
