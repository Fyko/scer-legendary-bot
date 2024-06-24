/* eslint-disable import/order */
import type Database from 'bun:sqlite';
import { parse } from 'csv-parse/sync';
import { inlineCode, type ChatInputCommandInteraction } from 'discord.js';
import process from 'node:process';

export async function seed(db: Database, interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
	await interaction.deferReply();

	if (interaction.user.id !== process.env.CARTER_USER_ID) {
		return void interaction.editReply('You are not authorized to seed the database.');
	}

	const file = interaction.options.getAttachment('file');
	if (!file) {
		return void interaction.editReply('No file was attached.');
	}

	const text = await fetch(file.url).then(async (res) => res.text());
	// csv headers: count,user_id
	const parsed = (parse(text, { columns: true }) as { count: string; user_id: string }[]).map((row) => ({
		count: Number(row.count),
		user_id: row.user_id,
	})) as { count: number; user_id: string }[];

	interaction.editReply(`Parsed ${inlineCode(parsed.length.toLocaleString('en-US'))} users. Seeding database...`);

	const query = db.prepare('insert into leggies (user_id, created_at) values ($user_id, $created_at);');

	for (const { count, user_id } of parsed) {
		for (let i = 0; i < count; i++) {
			query.run({ $user_id: user_id, $created_at: Date.now() });
		}
	}

	const count = parsed.reduce((acc, { count }) => acc + count, 0);

	return void interaction.editReply(
		`Database seeded! Created ${inlineCode(count.toLocaleString('en-US'))} leggy entries.`,
	);
}
