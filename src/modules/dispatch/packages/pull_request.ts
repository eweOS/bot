import { Context } from 'hono';
import DispatchMod from '../base';
import { GitHubApi } from '../../../api/github';

const mod: DispatchMod = {
	event: 'pull_request',
	repos: ['eweOS/packages'],
	func: mod_fn,
};

const condition = ['opened', 'reopened', 'synchronize'];

const condition_closed = ['closed'];

const automated_label = 'automated';
const assisted_by_pattern = /assisted-by:/i;

async function label_automated(githubApi: GitHubApi, pull_request: any) {
	if (!assisted_by_pattern.test(pull_request.body ?? '')) return;
	if (pull_request.labels?.some((label: any) => label.name === automated_label)) return;
	try {
		await githubApi.labelIssue(pull_request.number, [automated_label]);
	} catch (e) {
		console.error(`Failed to label PR #${pull_request.number} as ${automated_label}:`, e);
	}
}

async function mod_fn(c: Context, payload: any) {
	var dispatchoption = '';
	if (condition.includes(payload.action)) dispatchoption = 'pr';
	else if (condition_closed.includes(payload.action)) dispatchoption = 'pr_closed';
	else return;

	const pull_request = payload.pull_request;

	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);

	await label_automated(githubApi, pull_request);

	let base_branch = pull_request.base.ref;
	let pr_branch = pull_request.head.ref;

	if (!base_branch || !pr_branch) return; //No branch specified

	if (base_branch.startsWith('_')) return; //Ignored special branch

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
