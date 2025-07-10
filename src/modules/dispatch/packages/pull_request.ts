import { Context } from 'hono';
import DispatchMod from '../base';
import { GitHubApi } from '../../../api/github';

const mod: DispatchMod = {
	event: 'pull_request',
	repos: ['eweOS/packages'],
	func: mod_fn,
};

const condition = ['ready_for_review', 'opened', 'reopened', 'synchronize'];

const condition_closed = ['closed'];

async function mod_fn(c: Context, payload: any) {
	var dispatchoption = '';
	if (condition.includes(payload.action)) dispatchoption = 'pr';
	else if (condition_closed.includes(payload.action)) dispatchoption = 'pr_closed';
	else return;

	const pull_request = payload.pull_request;

	let base_branch = pull_request.base.ref;
	let pr_branch = pull_request.head.ref;

	if (!base_branch || !pr_branch) return; //No branch specified

	if (base_branch.startsWith('_')) return; //Ignored special branch

	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);

	await githubApi.dispatchRepository(dispatchoption, {
		pkg: base_branch,
		data: {
			id: pull_request.id,
			number: pull_request.number,
			sha: pull_request.head.sha,
		},
	});
}

export default mod;
