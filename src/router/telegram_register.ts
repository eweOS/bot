import { Hono } from 'hono';
import HonoEnv from '../bindings';
import { TelegramApi } from '../api/telegram';

const mod = new Hono<HonoEnv>({ strict: false });

mod.get('/registerWebhook', async (c) => {
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	const requestUrl = new URL(c.req.url);
	const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}/endpoint`;
	const r: any = await telegramApi.registerWebHook(webhookUrl, c.env.ENV_BOT_SECRET);
	return 'ok' in r && r.ok ? c.text('Ok') : c.json(r);
});

mod.get('/unRegisterWebhook', async (c) => {
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	const r: any = await telegramApi.unregisterWebHook();
	return 'ok' in r && r.ok ? c.text('Ok') : c.json(r);
});

export default mod;
