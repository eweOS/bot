import { Context } from 'hono';
import { testarg_pkgname } from '../../utils/cmdargs';
import dispatch_mod from '../dispatch/packages/pull_request.js';
import CommandMod from './base';
import { GitHubApi } from '../../api/github';
import { TelegramApi } from '../../api/telegram';
import OBSApi from '../../api/obs';

const mod: CommandMod = {
	command: '/trigger',
	func: mod_fn,
	filter: testarg_pkgname,
};

async function mod_fn(c: Context, message: any, args: any) {
	const pkg_name = args;
	const obsApi = new OBSApi(c.env.ENV_OBS_TOKEN);
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	const obsResponse = await obsApi.dispatchProject('eweOS:Main', pkg_name);
	if (obsResponse.status !== 200) {
		const errorMessage = `🚨 OBS API Error\n\nFailed to dispatch package: ${pkg_name}\n\nStatus: ${obsResponse.status}\nStatus Text: ${obsResponse.statusText}`;
		await telegramApi.sendPlainText(Number(c.env.ENV_BOT_WORKFLOW_CHANNEL), errorMessage);
		await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '😢');
	} else {
		await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🎉');
	}
}

export default mod;
