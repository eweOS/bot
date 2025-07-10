import { Context } from 'hono';
import { split_command_once, testarg_pkgname, testarg_string_not_quoted } from '../../utils/cmdargs';
import CommandMod from './base';
import { GitHubApi } from '../../api/github';
import { TelegramApi } from '../../api/telegram';

const mod: CommandMod = {
	command: '/bumpver',
	func: mod_fn,
	filter: mod_filter,
};

function mod_filter(args: string) {
	if (!args) return false;
	const { first: pkgname, remains: version } = split_command_once(args);
	if (!testarg_pkgname(pkgname)) return false;
	if (!version) return false;
	if (!testarg_string_not_quoted(version)) return false;
	return true;
}

async function mod_fn(c: Context, message: any, args: any) {
	const { first: pkgname, remains: version } = split_command_once(args);
	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
	const res = await githubApi.dispatchWorkflow('bump_ver.yml', {
		package: pkgname,
		version: version,
	});
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	await telegramApi.sendDispatchResult(message.chat.id, res, message.message_id);
}

export default mod;
