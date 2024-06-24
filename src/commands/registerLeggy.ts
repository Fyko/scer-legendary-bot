import type Database from 'bun:sqlite';
import { stripIndents } from 'common-tags';
import { inlineCode, type MessageContextMenuCommandInteraction } from 'discord.js';
import { countLeggiesForUser, LeggyEntity } from '../db';

export async function registerLeggy(
	db: Database,
	interaction: MessageContextMenuCommandInteraction<'cached'>,
): Promise<void> {
	await interaction.deferReply({ ephemeral: true });
	const message = interaction.targetMessage;

	const exists = db
		.prepare('select * from leggies where message_url = $message_url')
		.as(LeggyEntity)
		.get({ $message_url: message.url });
	if (exists) {
		return void interaction.editReply({
			content: `Leggy already registered for ${message.url}`,
			components: [],
		});
	}

	// add it to the database
	const query = db
		.query(
			stripIndents`insert into leggies (
				user_id,
				message_url,
				created_at
			) values (
				$user_id,
				$message_url,
				$created_at
			) returning id, user_id, message_url, created_at;`,
		)
		.as(LeggyEntity);

	const inserted = query.get({
		$user_id: message.author.id,
		$message_url: message.url,
		$created_at: Date.now(),
	})!;
	const count = countLeggiesForUser(db, message.author.id);

	await interaction.editReply({
		content: `Successfully registered leggy ${inlineCode(`#${count}`)} for ${message.author.toString()} (${inlineCode(
			`#${inserted.id}`,
		)})!`,
		components: [],
	});
}
