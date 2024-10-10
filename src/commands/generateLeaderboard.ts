import type Database from 'bun:sqlite';
import { stripIndents } from 'common-tags';
import {
	bold,
	inlineCode,
	italic,
	time,
	TimestampStyles,
	underline,
	userMention,
	type ChatInputCommandInteraction,
} from 'discord.js';
import { BoardUpdateEntity, LeggyEntity } from '../db';

export async function generateLeaderboard(
	db: Database,
	interaction: ChatInputCommandInteraction<'cached'>,
): Promise<void> {
	await interaction.deferReply();

	const rows = db.query('select id, user_id, message_url, created_at from leggies;').as(LeggyEntity).all();
	const lastUpdate = db
		.query('select id, created_at from board_updates order by created_at desc limit 1;')
		.as(BoardUpdateEntity)
		.get()!;
	// the number of leggies added per player since the last update
	const addedSinceLastUpdate = new Map<string, number>();
	const count = new Map<string, number>(); // user_id -> count
	for (const leggy of rows) {
		// count how many the user has in total
		const countForUser = count.get(leggy.user_id) ?? 0;
		count.set(leggy.user_id, countForUser + 1);

		// count how many the user has added since the last update
		if (leggy.createdAt.getTime() < lastUpdate.createdAt.getTime()) continue;
		const added = addedSinceLastUpdate.get(leggy.user_id) ?? 0;
		addedSinceLastUpdate.set(leggy.user_id, added + 1);
	}

	console.log(count);
	const counts = Array.from([...count.entries()].map(([user_id, count]) => ({ user_id, count }))).sort(
		(a, b) => b.count - a.count,
	);

	let addedCount = 0;
	for (const x of addedSinceLastUpdate.values()) {
		addedCount += x;
	}

	const now = new Date();
	const lines: string[] = [
		`Last updated on ${time(now, TimestampStyles.LongDate)} (${time(now, TimestampStyles.RelativeTime)})`,
		`Total Leggies: ${bold(italic(inlineCode(rows.length.toLocaleString('en-US'))))}`,
		`Leggies added since last update: ${bold(italic(inlineCode(addedCount.toLocaleString('en-US'))))}`,
	];
	const headings = ['# 🥇 `{{ number }}` Leggies', '## 🥈 `{{ number }}` Leggies', '### 🥉 `{{ number }}` Leggies'];

	// create three arrays of leggies which take the top 3 spods. it is possible to have a tie for all 3 places
	for (const heading of headings) {
		if (!rows.length) break;

		// get the ranking count of leggies
		const ranking = counts[0].count;
		// get all leggies with the ranking
		const players = counts.filter((leggy) => leggy.count === ranking);
		// remove the ranking leggies from the list
		counts.splice(0, players.length);
		// create a string of the ranking leggies
		const str = stripIndents`
			${heading.replace('{{ number }}', ranking.toLocaleString())}
			${players
				.map(({ user_id }) => {
					const count = addedSinceLastUpdate.get(user_id) ?? 0;
					let base = userMention(user_id);
					if (count) base += ` (**🔺${count}**)`;
					return base;
				})
				.join(', ')}
		`;
		lines.push(str);
	}

	// do other
	if (counts.length) {
		// chunk the remaining users by count
		const chunked = counts.reduce<Record<number, { count: number; user_id: string }[]>>((acc, leggy) => {
			if (!acc[leggy.count]) acc[leggy.count] = [];
			acc[leggy.count].push(leggy);
			return acc;
		}, {});

		lines.push('🏅 Other');

		for (const [count, users] of Object.entries(chunked).reverse()) {
			const str = `${bold(underline(count))}. ${users
				.map(({ user_id }) => {
					const count = addedSinceLastUpdate.get(user_id) ?? 0;
					let base = userMention(user_id);
					if (count) base += ` (**🔺${count}**)`;
					return base;
				})
				.join(', ')}`;
			lines.push(str);
		}
	}

	lines.push(italic('\nℹ️ Note: The order of users for each leggy count is random.'));

	const chunks = smartChunk(lines, 1_950, '\n');

	for (const [idx, chunk] of chunks.entries()) {
		const content = chunk.join('\n');
		console.debug(`Sending chunk ${idx + 1} of ${chunks.length}: ${content.length} characters`);

		if (idx === 0) await interaction.editReply(content);
		else await interaction.followUp(content);
	}

	db.query('insert into board_updates (created_at) values ($created_at);').run({ $created_at: Date.now() });
}

export function smartChunk(data: string[], maxPerChunk: number, join = ''): string[][] {
	let buffer: string[] = [];
	const fragments: string[][] = [];

	for (const content of data) {
		const totalBufferLength = buffer.reduce((acc, v) => acc + v.length, 0);

		if (content.length + totalBufferLength + join.length <= maxPerChunk) buffer.push(content);
		else {
			fragments.push(buffer);
			buffer = [];
		}
	}

	if (buffer.length) fragments.push(buffer);
	return fragments;
}
