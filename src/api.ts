import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import { count, desc, eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { ip } from 'elysia-ip';
import type { Generator } from 'elysia-rate-limit';
import { rateLimit } from 'elysia-rate-limit';
import { discordUser, leggies } from '@/db/schema';
import { apiLogger } from '@/logger';
import { db } from '@/main';

const generator: Generator<{ ip: string }> = async (_, __, { ip }) => Bun.hash(ip).toString();

export const api = new Elysia({ serve: { development: true } })
	.use(swagger())
	.use(serverTiming())
	.use(ip())
	.use(rateLimit({ duration: 5_000, max: 10, generator }))
	.use(apiLogger())
	.use(cors())
	.get('/api/v1/latest', async ({ query }) => {
		const rows = await db
			.select()
			.from(leggies)
			.leftJoin(discordUser, eq(discordUser.id, leggies.user_id))
			.limit(query.limit)
			.offset((query.page - 1) * query.limit)
			.orderBy(desc(leggies.created_at));

		return rows.map(({ leggy, discord_user: user }) => ({
			id: leggy!.id,
			index: leggy!.index,
			url: leggy!.message_url,
			user: {
				id: user?.id,
				username: user?.display_name,
				avatar_url: user?.avatar_url,
			},
			created_at: leggy!.created_at,
		}));
	}, {
		query: t.Object({
			limit: t.Number({ default: 10 }),
			page: t.Number({ default: 1 }),
		})
	})
	.get('/api/v1/leaderboard', async () => {
		// select
		// 	counts.user_id,
		// 	counts.total,
		// 	discord_user.display_name,
		// 	discord_user.avatar_url
		// from (
		// 	select
		// 		user_id,
		// 		count(*) as total
		// 	from leggy
		// 	group by user_id
		// ) counts
		// left join discord_user on discord_user.id = counts.user_id
		// order by counts.total desc;
		const counts = db
			.select({ user_id: leggies.user_id, total: count().as('total') })
			.from(leggies)
			.groupBy(leggies.user_id)
			.as('counts');

		return db
			.select({
				user_id: counts.user_id,
				total: counts.total,
				display_name: discordUser.display_name,
				avatar_url: discordUser.avatar_url,
			})
			.from(counts)
			.leftJoin(discordUser, eq(discordUser.id, counts.user_id))
			.orderBy(desc(counts.total));
	});
