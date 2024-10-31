import { eq, isNull, lte, or } from 'drizzle-orm';
import { discordUser, leggies } from '@/db/schema';
import { client, db } from '@/main';

const inThreeHours = () => new Date(Date.now() + 3 * 60 * 60 * 1_000);

export async function startJobs(): Promise<void> {
	console.log('Starting jobs');
	await ensureDiscordUsers();

	setInterval(refreshDiscordUsers, 5 * 60 * 1_000 /* 5 minutes */);
}

async function refreshDiscordUsers(): Promise<void> {
	const toRefresh = await db.select().from(discordUser).where(lte(discordUser.refetch_at, new Date()));
	for (const row of toRefresh) {
		const user = await client.users.fetch(row.id);

		await db
			.update(discordUser)
			.set({
				refetch_at: inThreeHours(),
				display_name: user.displayName,
				avatar_url: user.displayAvatarURL({ size: 256 }),
			})
			.where(eq(discordUser.id, row.id));
	}

	console.log(`Refreshed ${toRefresh.length} discord users`);
}

/**
 * Fetches all distinct user_ids from registered leggies to ensure a discord_user row exists for each user.
 *
 * This is done once on startup, then never again.
 */
async function ensureDiscordUsers(): Promise<void> {
	const users = await db
		.selectDistinct({ user_id: leggies.user_id })
		.from(leggies)
		.leftJoin(discordUser, eq(leggies.user_id, discordUser.id))
		.where(or(isNull(discordUser.display_name), isNull(discordUser.refetch_at)));

	for (const { user_id } of users) {
		const usr = await client.users.fetch(user_id);

		await db
			.insert(discordUser)
			.values({
				id: user_id,
				display_name: usr.displayName,
				avatar_url: usr.displayAvatarURL({ size: 256 }),
				refetch_at: inThreeHours(),
			})
			.onDuplicateKeyUpdate({
				set: {
					refetch_at: inThreeHours(),
					display_name: usr.displayName,
					avatar_url: usr.displayAvatarURL({ size: 256 }),
				},
			});
	}
}
