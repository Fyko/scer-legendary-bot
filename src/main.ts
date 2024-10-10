import Database from 'bun:sqlite';
import type { ChatInputCommandInteraction, MessageContextMenuCommandInteraction } from 'discord.js';
import { Client, Events, IntentsBitField, Options } from 'discord.js';
// eslint-disable-next-line import/order
import process from 'node:process';
import { generateLeaderboard } from './commands/generateLeaderboard.ts';
import { registerLeggy } from './commands/registerLeggy.ts';
import { seed } from './commands/seed.ts';
import { migrate } from './db.ts';

process.env.ENV ??= 'development';

const databaseUrl = process.env.ENV === 'development' ? './data/leggies.sqlite' : '/app/data/leggies.sqlite';
console.debug(`Using database at ${databaseUrl}`);
const db = new Database(databaseUrl, {
	create: true,
});
db.exec('PRAGMA journal_mode = WAL;');

const client = new Client({
	intents: [IntentsBitField.Flags.Guilds],
	makeCache: Options.cacheWithLimits({
		MessageManager: 10,
	}),
});

client.on(Events.Debug, (message) => console.debug(`[DEBUG] ${message}`));

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user!.tag} (${client.user!.id})`);
	const query = db.query('select count(*) as count from leggies;');
	const { count } = query.get() as { count: number };
	console.log(`There are ${count} leggies in the database.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const name = interaction.commandName.toLowerCase();

	if (name === 'register leggy' && interaction.isMessageContextMenuCommand()) {
		await registerLeggy(db, interaction as MessageContextMenuCommandInteraction<'cached'>);
	}

	if (interaction.isChatInputCommand()) {
		if (name === 'generate-leaderboard')
			await generateLeaderboard(db, interaction as ChatInputCommandInteraction<'cached'>);
		else if (name === 'seed') await seed(db, interaction as ChatInputCommandInteraction<'cached'>);
	}
});

migrate(db);
client.login();

// listen for a close signal
const closeSignals = ['SIGINT', 'SIGTERM'];
for (const signale of closeSignals) {
	process.on(signale, () => {
		console.log(`Received ${signale}, closing client`);
		client.destroy();
		db.close();

		process.exit(0);
	});
}
