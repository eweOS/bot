import { GitHubApi } from '../../../api/github';
import OBSApi from '../../../api/obs';
import DispatchMod from '../base';
import { Context } from 'hono';
import { TelegramApi } from '../../../api/telegram';

const mod: DispatchMod = {
	event: 'push',
	repos: ['eweOS/packages'],
	func: mod_fn,
};

async function mod_fn(c: Context, payload: any) {
	let branch = payload.ref;

	if (!branch) return; // No branch specified

	if (!branch.startsWith('refs/heads/')) return; // Invalid tag

	const pkg_name = branch.replace('refs/heads/', '');
	if (pkg_name.startsWith('_')) return; // Ignored special branch

	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
	const obsApi = new OBSApi(c.env.ENV_OBS_TOKEN);
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);

	if (!payload.created) {
		const obsResponse = await obsApi.dispatchProject('eweOS:Main', pkg_name);
		if (obsResponse.status !== 200) {
			const errorMessage = `🚨 OBS API Error\n\nFailed to dispatch package: ${pkg_name}\n\nStatus: ${obsResponse.status}\nStatus Text: ${obsResponse.statusText}`;
			await telegramApi.sendPlainText(Number(c.env.ENV_BOT_WORKFLOW_CHANNEL), errorMessage);
		}
		await githubApi.dispatchRepository('push', { pkg: pkg_name });
	} else if (!payload.deleted) {
		await githubApi.dispatchRepository('creation', { pkg: pkg_name });
	}
}

export default mod;
