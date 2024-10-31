/* eslint-disable @typescript-eslint/no-use-before-define */
import { relations, sql } from 'drizzle-orm';
import { index, mysqlTable, serial, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const leggies = mysqlTable(
	'leggy',
	{
		id: varchar({ length: 32 }).primaryKey(),
		index: serial(),
		user_id: varchar({ length: 22 }).notNull(),
		message_url: text(),
		created_at: timestamp().defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('user_id_idx').on(table.user_id),
	}),
);

export const leggiesRelations = relations(leggies, ({ one }) => ({
	user: one(discordUser, {
		fields: [leggies.user_id],
		references: [discordUser.id],
	}),
}));

export const boardUpdates = mysqlTable('board_update', {
	id: varchar({ length: 32 }).primaryKey(),
	created_at: timestamp().defaultNow().notNull(),
});

export const sqliteMigrated = mysqlTable('sqlite_migrated', {
	id: serial().primaryKey(),
	created_at: timestamp().defaultNow().notNull(),
});

export const discordUser = mysqlTable('discord_user', {
	id: varchar({ length: 22 }).primaryKey(),
	display_name: varchar({ length: 128 }).notNull(),
	avatar_url: text().notNull(),
	refetch_at: timestamp()
		.notNull()
		.default(sql`(NOW() + INTERVAL 12 HOUR)`),
});

export const discordUserRelations = relations(discordUser, ({ many }) => ({
	leggies: many(leggies),
}));
