import type Database from 'bun:sqlite';
import { stripIndents } from 'common-tags';
import {
	bold,
	italic,
	time,
	TimestampStyles,
	underline,
	userMention,
	type ChatInputCommandInteraction,
} from 'discord.js';

export async function generateLeaderboard(
	db: Database,
	interaction: ChatInputCommandInteraction<'cached'>,
): Promise<void> {
	await interaction.deferReply();

	const leggies = db
		.query('select user_id, count(*) as count from leggies group by user_id order by count desc;')
		.all() as { count: number; user_id: string }[];

	const now = new Date();
	const lines: string[] = [
		`Last updated on ${time(now, TimestampStyles.LongDate)} (${time(now, TimestampStyles.RelativeTime)})`,
	];
	const headings = ['# 🥇 `{{ number }}` Leggies', '## 🥈 `{{ number }}` Leggies', '### 🥉 `{{ number }}` Leggies'];

	// create three arrays of leggies which take the top 3 spods. it is possible to have a tie for all 3 places
	for (const heading of headings) {
		if (!leggies.length) break;

		// get the highest count of leggies
		const highest = leggies[0].count;
		// get all leggies with the highest
		const players = leggies.filter((leggy) => leggy.count === highest);
		// remove the highest leggies from the list
		leggies.splice(0, players.length);
		// create a string of the highest leggies
		const str = stripIndents`
			${heading.replace('{{ number }}', highest.toLocaleString())}
			${players.map(({ user_id }) => userMention(user_id)).join(', ')}
		`;
		lines.push(str);
	}

	// do other
	if (leggies.length) {
		// chunk the remaining users by count
		const chunked = leggies.reduce<Record<number, { count: number; user_id: string }[]>>((acc, leggy) => {
			if (!acc[leggy.count]) acc[leggy.count] = [];
			acc[leggy.count].push(leggy);
			return acc;
		}, {});

		lines.push('🏅 Other');

		for (const [count, users] of Object.entries(chunked)) {
			const str = `${bold(underline(count))}. ${users.map(({ user_id }) => userMention(user_id)).join(', ')}`;
			lines.push(str);
		}
	}

	lines.push(italic('\nℹ️ Note: The order of users for each leggy count is random.'));

	// todo(fyko): 4,000 character message splitting

	interaction.editReply(lines.join('\n'));
}
