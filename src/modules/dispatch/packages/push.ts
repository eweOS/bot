import { GitHubApi } from '../../../api/github';
import OBSApi from '../../../api/obs';
import DispatchMod from '../base';
import { Context } from 'hono';

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

	if (!payload.created) {
		await obsApi.dispatchProject('eweOS:Main', pkg_name);
		await githubApi.dispatchRepository('push', { pkg: pkg_name });
	} else {
		await githubApi.dispatchRepository('creation', { pkg: pkg_name });
	}
}

export default mod;
