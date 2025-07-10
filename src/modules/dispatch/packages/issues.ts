import { Context } from 'hono';
import DispatchMod from '../base';
import { GitHubApi } from '../../../api/github';

const mod: DispatchMod = {
	event: 'issues',
	repos: ['eweOS/packages'],
	func: mod_fn,
};

const condition = ['opened', 'reopened', 'edited'];

const action_add = '[AddPkg]';
const action_remove = '[RemovePkg]';

const valid_label = 'issue-action: valid';
const invalid_label = 'issue-action: invalid';

// format: package_name1(, package_name2, ...)
// package_name: [a-zA-Z0-9-_\.]+
function validate(title: string) {
	return title.match(/^[a-zA-Z0-9-_\.]+(?:, [a-zA-Z0-9-_\.]+)*$/);
}

async function verify_issue(c: Context, issue: number, pkgs: string) {
	const githubApi = new GitHubApi(c.env.ENV_GITHUB_APP_ID, c.env.ENV_GITHUB_APP_KEY, c.env.ENV_GITHUB_APP_INSTALL);
	if (!validate(pkgs)) {
		await githubApi.labelIssue(issue, [invalid_label]);
		try {
			await githubApi.delabelIssue(issue, valid_label);
		} finally {
			return;
		}
	} else {
		await githubApi.labelIssue(issue, [valid_label]);
		try {
			await githubApi.delabelIssue(issue, invalid_label);
		} finally {
			return;
		}
	}
}

async function mod_fn(c: Context, payload: any) {
	if (payload.issue.state != 'open') return;
	if (condition.includes(payload.action)) {
		if (payload.issue.title.split(' ')[0] == action_add || payload.issue.title.split(' ')[0] == action_remove)
			await verify_issue(c, payload.issue.number, payload.issue.title.substring(payload.issue.title.split(' ')[0].length + 1));
		return;
	}
}

export default mod;
