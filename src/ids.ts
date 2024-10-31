import { generate } from 'xksuid';

export function generateKsuid(prefix: 'btn' | 'bu' | 'lggy'): string {
	return `${prefix}_${generate()}`;
}
