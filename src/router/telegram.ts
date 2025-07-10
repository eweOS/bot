import { Hono } from 'hono';
import HonoEnv from '../bindings';
import modules from '../modules/command';
import { HTTPException } from 'hono/http-exception';
import { checkmessage } from '../filters';
import { TelegramApi } from '../api/telegram';

const mod = new Hono<HonoEnv>({ strict: false });

mod.use(async (c, next) => {
	if (c.req.header('X-Telegram-Bot-Api-Secret-Token') !== c.env.ENV_BOT_SECRET) throw new HTTPException(403, { message: 'Unauthorized' });
	else await next();
});

mod.post('/', async (c) => {
	const update = await c.req.json();
	if ('message' in update) {
		const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
		const message = update.message;
		if (!('text' in update.message)) return c.text("ignore");
		if (!checkmessage(update.message)) await telegramApi.sendReactionSimple(update.message.chat.id, update.message.message_id, '🤡');
		else {
			if (!update.message.text.startsWith('/')) return c.text("ignore");
			var command = update.message.text.split(' ')[0];
			var standard_command = command.replace('@eweos_bot', '');
			let command_args = null;
			if (message.text.trim() !== command) command_args = message.text.slice(command.length + 1).trim();
			if (standard_command in modules) {
				const exec_cmd_fn = modules[standard_command].func;
				if (modules[standard_command].context_filter)
					if (!modules[standard_command].context_filter?.(message)) {
						await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🙊');
						return c.text("ignore");
					}
				if (modules[standard_command].filter)
					if (!modules[standard_command].filter?.(command_args)) {
						await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🤨');
						return c.text("ignore");
					}
				await exec_cmd_fn(c, message, command_args);
			} else await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🤷');
		}
	}
	return c.text("Ok")
});

export default mod;
