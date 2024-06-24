import type Database from 'bun:sqlite';
import { stripIndents } from 'common-tags';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	DiscordjsError,
	DiscordjsErrorCodes,
	inlineCode,
	type MessageContextMenuCommandInteraction,
} from 'discord.js';
import { ulid } from 'ulid';
import { countLeggiesForUser, LeggyEntity } from '../db';

export async function registerLeggy(
	db: Database,
	interaction: MessageContextMenuCommandInteraction<'cached'>,
): Promise<void> {
	const reply = await interaction.deferReply({ ephemeral: true });
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

	const undoId = ulid();

	const content = `Successfully registered leggy ${inlineCode(`#${count}`)} for ${message.author.toString()} (${inlineCode(
		`#${inserted.id}`,
	)})!`;
	await interaction.editReply({
		content,
		components: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Undo').setEmoji('↩️').setCustomId(undoId),
			),
		],
	});

	// undo button
	try {
		const collected = await reply.awaitMessageComponent({
			filter: (collected) => collected.user.id === interaction.user.id,
			time: 15_000,
			componentType: ComponentType.Button,
		});

		if (collected.customId === undoId) {
			db.query('delete from leggies where id = $id').run({ $id: inserted.id });

			await interaction.editReply({ content, components: [] });

			return void interaction.followUp({
				content: `Successfully deleted leggy reaction ${inlineCode(`#${inserted.id}`)}.`,
				components: [],
			});
		}
	} catch (error: unknown) {
		// timed out
		if (error instanceof DiscordjsError && error.code === DiscordjsErrorCodes.InteractionCollectorError) {
			return void interaction.editReply({
				content,
				components: [],
			});
		} else {
			console.error(error);
		}
	}
}
