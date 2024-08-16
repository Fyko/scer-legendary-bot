import type Database from 'bun:sqlite';
import { stripIndents } from 'common-tags';

export function migrate(db: Database): void {
	db.query(
		stripIndents`
		create table if not exists leggies (
			id integer primary key autoincrement,
			user_id text not null,
			message_url text,
			created_at number not null
		);
	`,
	).run();

	db.query(
		`
		create index if not exists leggies_user_id on leggies (user_id);
	`,
	).run();

	db.query(
		stripIndents`
		create table if not exists board_updates (
			id integer primary key autoincrement,
			created_at number not null
		);
	`,
	).run();

	// if the db is empty, create a board_updates record for this very second
	const query = db.query('select count(*) as count from board_updates;');
	const { count } = query.get() as { count: number };
	if (count === 0) {
		db.query('insert into board_updates (created_at) values ($created_at);').run({ $created_at: Date.now() });
	}
}

export function countLeggiesForUser(db: Database, user_id: string): number {
	const query = db.query('select count(*) as count from leggies where user_id = $user_id;');
	const { count } = query.get({ $user_id: user_id }) as { count: number };

	return count;
}

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
