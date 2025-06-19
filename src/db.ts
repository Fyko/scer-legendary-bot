import { count, eq } from 'drizzle-orm';
import { leggies } from '@/db/schema';
import { db } from '@/main';

export async function countLeggiesForUser(user_id: string): Promise<number> {
	const [{ amount }] = await db.select({ amount: count() }).from(leggies).where(eq(leggies.user_id, user_id));

	return amount;
}
