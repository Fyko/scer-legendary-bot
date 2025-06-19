import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { defineConfig } from 'drizzle-kit';

expand(config());

export default defineConfig({
	dialect: 'mysql',
	verbose: true,
	schema: './src/db/schema.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
