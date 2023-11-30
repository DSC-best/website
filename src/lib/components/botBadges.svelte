<script lang="ts">
	import type { Bot } from '@prisma/client';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { BotApprovalStatus } from '@prisma/client';

	export let bot: Bot;
	export let className: string = '';
</script>

<div class={`bot-badges ${className}`}>
	{#if bot?.nsfw}
		<Wrapper>
			<span class="badge badge-danger" style="margin-right: 5px;">NSFW</span>
			<Tooltip>This bot is not safe for work!</Tooltip>
		</Wrapper>
	{/if}
	{#if bot?.approval_status !== BotApprovalStatus.APPROVED && bot?.approval_status !== BotApprovalStatus.PENDING}
		<Wrapper>
			<span class="badge badge-danger" style="margin-right: 5px;">
				{bot?.approval_status}
			</span>
			<Tooltip>This bot is not listed on our site</Tooltip>
		</Wrapper>
	{/if}
	{#if bot?.approval_status === BotApprovalStatus.PENDING}
		<Wrapper>
			<span class="badge badge-primary" style="margin-right: 5px;">
				{bot?.approval_status}
			</span>
			<Tooltip>This bot is pending approval from one of our bot approvers!</Tooltip>
		</Wrapper>
	{/if}
	{#if bot?.verified}
		<Wrapper>
			<span class="badge badge-primary" style="margin-right: 5px;">Verified</span>
			<Tooltip>This is a verified bot!</Tooltip>
		</Wrapper>
	{/if}
</div>
