import { Context } from 'hono';
import { testarg_pkgname } from '../../utils/cmdargs';
import CommandMod from './base';
import { TelegramApi } from '../../api/telegram';
import { GitHubApi } from '../../api/github';

const mod: CommandMod = {
	command: '/newpkg',
	func: mod_fn,
	filter: testarg_pkgname,
};

async function mod_fn(c: Context, message: any, args: any) {
	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
	const res = await githubApi.dispatchWorkflow('create_package.yml', {
		package: args,
	});
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	await telegramApi.sendDispatchResult(message.chat.id, res, message.message_id);
}

export default mod;
