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
import { eq, sql } from 'drizzle-orm';
import { countLeggiesForUser } from '@/db';
import { discordUser, leggies } from '@/db/schema';
import { generateKsuid } from '@/ids';
import { db } from '@/main';

export async function registerLeggy(interaction: MessageContextMenuCommandInteraction<'cached'>): Promise<void> {
	const reply = await interaction.deferReply({ ephemeral: true });
	const message = interaction.targetMessage;

	const exists = await db.select().from(leggies).where(eq(leggies.message_url, message.url)).limit(1);

	if (exists.length) {
		return void interaction.editReply({
			content: `Leggy already registered for ${message.url}`,
			components: [],
		});
	}

	// upsert discord user
	await db
		.insert(discordUser)
		.values({
			id: message.author.id,
			display_name: message.author.displayName,
			avatar_url: message.author.displayAvatarURL({ size: 256 }),
		})
		.onDuplicateKeyUpdate({
			set: {
				display_name: message.author.displayName,
				refetch_at: sql`NOW() + INTERVAL 12 HOUR`,
			},
		});

	// add it to the database
	const id = generateKsuid('lggy');
	await db.insert(leggies).values({
		id,
		user_id: message.author.id,
		message_url: message.url,
	});

	const count = countLeggiesForUser(message.author.id);

	const undoId = generateKsuid('btn');

	const content = `Successfully registered leggy ${inlineCode(`#${count}`)} for ${message.author.toString()} (${inlineCode(
		id,
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
			time: 30_000,
			componentType: ComponentType.Button,
		});

		if (collected.customId === undoId) {
			await db.delete(leggies).where(eq(leggies.id, id));

			await interaction.editReply({ content, components: [] });

			return void interaction.followUp({
				content: `Successfully deleted leggy reaction ${inlineCode(id)}.`,
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
