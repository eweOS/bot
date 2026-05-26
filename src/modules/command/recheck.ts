import { Context } from 'hono';
import { testarg_number } from '../../utils/cmdargs';
import dispatch_mod from '../dispatch/packages/pull_request.js';
import CommandMod from './base';
import { GitHubApi } from '../../api/github';
import { TelegramApi } from '../../api/telegram';

const mod: CommandMod = {
	command: '/recheck',
	func: mod_fn,
	filter: testarg_number,
};

async function mod_fn(c: Context, message: any, args: any) {
	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	let res;
	try {
		res = await githubApi.getPackagePR(args);
	} catch (e: any) {
		if (e.status == 404 || res == undefined) {
			await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🤷');
			return;
		}
	}
	const payload = res.data;
	if (payload.state == 'open') {
		await dispatch_mod.func(c, {
			action: 'synchronize',
			repository: { full_name: 'eweOS/packages' },
			pull_request: payload,
		});
		await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🎉');
	} else await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🥱');
}

export default mod;
