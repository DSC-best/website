// See https://kit.svelte.dev/docs/types#app

import type { User } from '@prisma/client';
import type { Client } from 'discord.js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			actor: User | null;
			token: string | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
