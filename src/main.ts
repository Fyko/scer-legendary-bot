import type { ChatInputCommandInteraction, MessageContextMenuCommandInteraction } from 'discord.js';
import { Client, Events, IntentsBitField, Options } from 'discord.js';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { api } from '@/api.ts';
import { generateLeaderboard } from '@/commands/generateLeaderboard.ts';
import { registerLeggy } from '@/commands/registerLeggy.ts';
import type * as schema from '@/db/schema.ts';
import { leggies, sqliteMigrated } from '@/db/schema.ts';
import { startJobs } from '@/jobs.ts';
import { logger } from '@/logger.ts';
import { migrateSqlite } from '@/migrate.ts';

process.env.ENV ??= 'development';

// @ts-expect-error idk why bun is pooping itself here
const migrationsFolder = Bun.fileURLToPath(new URL('../drizzle', import.meta.url));
logger.info(`Running migrations from ${migrationsFolder}`);
export const db: MySql2Database<typeof schema> = drizzle({ connection: process.env.DATABASE_URL! });
await migrate(db, { migrationsFolder });

const migrated = await db.$count(sqliteMigrated);
if (!migrated) {
	logger.info('Migrating SQLite database');
	await migrateSqlite();
}

const discordLogger = logger.child({ module: 'discord' });
export const client = new Client({
	intents: [IntentsBitField.Flags.Guilds],
	makeCache: Options.cacheWithLimits({
		MessageManager: 10,
	}),
});

client.on(Events.Debug, (message) => discordLogger.debug(message));

client.on(Events.ClientReady, async () => {
	discordLogger.info(`Logged in as ${client.user!.tag} (${client.user!.id})`);
	const count = await db.$count(leggies);

	discordLogger.info(`There are ${count} leggies in the database.`);

	await startJobs();
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const name = interaction.commandName.toLowerCase();

	if (name === 'register leggy' && interaction.isMessageContextMenuCommand()) {
		await registerLeggy(interaction as MessageContextMenuCommandInteraction<'cached'>);
	}

	if (interaction.isChatInputCommand() && name === 'generate-leaderboard')
		await generateLeaderboard(interaction as ChatInputCommandInteraction<'cached'>);
});

client.on(Events.Warn, (message) => discordLogger.warn(`[WARN] ${message}`));

client.rest.on('rateLimited', (rateLimitData) =>
	discordLogger.warn(
		`Rate limited: ${rateLimitData.method} ${rateLimitData.route} (${rateLimitData.retryAfter / 1_000}s)`,
	),
);

client.rest.on('restDebug', (message) => discordLogger.debug(`[REST] ${message}`));

api.listen(3_223, () => logger.info('API listening on port 3223'));
client.login();
