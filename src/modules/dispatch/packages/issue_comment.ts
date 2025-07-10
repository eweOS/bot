import { Context } from 'hono';
import { GitHubApi } from '../../../api/github';
import DispatchMod from '../base';

const mod: DispatchMod = {
	event: 'issue_comment',
	repos: ['eweOS/packages'],
	func: mod_fn,
};

const action_add = '[AddPkg]';
const action_remove = '[RemovePkg]';

const condition = ['created'];
const association = ['OWNER', 'MEMBER', 'COLLABORATOR'];

const valid_label = 'issue-action: valid';
const invalid_label = 'issue-action: invalid';

async function mod_fn(c: Context, payload: any) {
	if ('pull_request' in payload.issue) return;
	if (!condition.includes(payload.action)) return;
	if (payload.issue.title.split(' ')[0] == action_add || payload.issue.title.split(' ')[0] == action_remove) return;
	if (payload.issue.labels.find((o: any) => o.name === invalid_label)) return;
	if (!payload.issue.labels.find((o: any) => o.name === valid_label)) return;
	if (!association.includes(payload.comment.author_association)) return;
	if (!payload.comment.body.startsWith('/approve ')) return;

	if (payload.issue.title.split(' ')[0] == action_add) {
		const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
		for (let pkg_name of payload.issue.title.substring(action_add.length + 1).split(', '))
			await githubApi.dispatchRepository('creation', {
				pkg: pkg_name,
			});
		await githubApi.reactIssueComment(payload.comment.id, 'hooray');
	}
	return;
}

export default mod;
