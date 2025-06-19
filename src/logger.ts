import Elysia from 'elysia';
import pino from 'pino';

export const logger = pino({
	level: 'debug',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
});

export const apiLogger = ({ methods = ['GET', 'PUT', 'POST', 'DELETE'] } = {}) => {
	const _logger = logger.child({ module: 'api' });

	return new Elysia()
		.derive({ as: 'global' }, () => ({ start: Date.now() }))
		.onBeforeHandle({ as: 'global' }, (ctx) => {
			if (!methods.includes(ctx.request.method)) return;
			_logger.info(`<-- ${ctx.request.method} ${ctx.path}`);
		})
		.onAfterHandle({ as: 'global' }, (ctx) => {
			if (!methods.includes(ctx.request.method)) return;
			_logger.info(
				`--> ${ctx.request.method} ${ctx.path} ${ctx.set.status ?? Number.NaN} in ${Date.now() - ctx.start}ms`,
			);
		})
		.onError({ as: 'global' }, (ctx) => {
			if (!methods.includes(ctx.request.method)) return;
			_logger.info(
				`--> ${ctx.request.method} ${ctx.path} ${ctx.set.status} in ${ctx.start ? Date.now() - ctx.start : Number.NaN} ms`,
			);
		});
};
