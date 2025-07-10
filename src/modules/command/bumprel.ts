import { Context } from 'hono';
import { split_command_once, testarg_pkgname, testarg_string_not_quoted } from '../../utils/cmdargs';
import { GitHubApi } from '../../api/github';
import { TelegramApi } from '../../api/telegram';
import CommandMod from './base';

const mod: CommandMod = {
	command: '/bumprel',
	func: mod_fn,
	filter: mod_filter,
};

function mod_filter(args: any) {
	if (!args) return false;
	const { first: pkgname, remains: desc } = split_command_once(args, '\n');
	if (!testarg_pkgname(pkgname)) return false;
	if (desc) if (!testarg_string_not_quoted(desc)) return false;
	return true;
}

async function mod_fn(c: Context, message: any, args: any) {
	const { first: pkgname, remains: desc } = split_command_once(args, '\n');
	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
	const res = await githubApi.dispatchWorkflow('bump_rel.yml', {
		package: pkgname,
		reason: desc ? desc : 'automated by eweos_bot',
	});
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	await telegramApi.sendDispatchResult(message.chat.id, res, message.message_id);
}

export default mod;
