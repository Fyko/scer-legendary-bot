CREATE TABLE `board_update` (
	`id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `board_update_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discord_user` (
	`id` varchar(22) NOT NULL,
	`display_name` varchar(128) NOT NULL,
	`avatar_url` text NOT NULL,
	`refetch_at` timestamp NOT NULL DEFAULT (NOW() + INTERVAL 12 HOUR),
	CONSTRAINT `discord_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leggy` (
	`id` varchar(32) NOT NULL,
	`index` serial AUTO_INCREMENT,
	`user_id` varchar(22) NOT NULL,
	`message_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leggy_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sqlite_migrated` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sqlite_migrated_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `leggy` (`user_id`);