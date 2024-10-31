import Database from 'bun:sqlite';
import { boardUpdates, leggies, sqliteMigrated } from './db/schema.ts';
import { generateKsuid } from './ids.ts';
import { db as mysql } from './main.ts';

export class LeggyEntity {
	public readonly id!: number;

	public readonly user_id!: string;

	public readonly message_url: string | undefined;

	public readonly created_at!: number;

	public get createdAt(): Date {
		return new Date(this.created_at);
	}
}

export class BoardUpdateEntity {
	public readonly id!: number;

	public readonly created_at!: number;

	public get createdAt(): Date {
		return new Date(this.created_at);
	}
}

export async function migrateSqlite(): Promise<boolean> {
	const databaseUrl = process.env.ENV === 'development' ? './data/leggies.sqlite' : '/app/data/leggies.sqlite';
	if (!(await Bun.file(databaseUrl).exists())) {
		console.debug(`Database does not exist, skipping migration.`);
		return true;
	}

	console.debug(`Using database at ${databaseUrl}`);
	const db = new Database(databaseUrl, {
		create: false,
		readwrite: true,
	});

	const leggyRows = db.query('select id, user_id, message_url, created_at from leggies;').as(LeggyEntity).all();
	await mysql.insert(leggies).values(
		leggyRows.map((leggy) => ({
			id: generateKsuid('lggy'),
			user_id: leggy.user_id,
			message_url: leggy.message_url,
			created_at: leggy.createdAt,
		})),
	);
	console.debug(`Migrated ${leggyRows.length} leggies.`);

	const boardUpdateRows = db.query('select id, created_at from board_updates;').as(BoardUpdateEntity).all();
	await mysql.insert(boardUpdates).values(
		boardUpdateRows.map((boardUpdate) => ({
			id: generateKsuid('bu'),
			created_at: boardUpdate.createdAt,
		})),
	);
	console.debug(`Migrated ${boardUpdateRows.length} board updates.`);

	db.close();
	await mysql.insert(sqliteMigrated).values({});

	console.debug(`Migration complete.`);
	return true;
}
