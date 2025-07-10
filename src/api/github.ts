import { App, Octokit } from 'octokit';

class GitHubApi {
	app: App;
	installNumber: number;
	constructor(appId: string, privateKey: string, installNumber: number) {
		this.app = new App({
			appId: appId,
			privateKey: privateKey,
		});
		this.installNumber = installNumber;
	}
	async init() {
		return await this.app.getInstallationOctokit(this.installNumber);
	}

	async getPackagePR(prNumber: number) {
		return await (await this.init()).request(`GET /repos/eweOS/packages/pulls/${prNumber}`);
	}

	async dispatchWorkflow(workflowName: string, data: any) {
		return await (
			await this.init()
		).request(`POST /repos/eweOS/workflow/actions/workflows/${workflowName}/dispatches`, {
			ref: 'master',
			inputs: data,
		});
	}

	async dispatchRepository(eventType: string, data: any) {
		return await (
			await this.init()
		).request(`POST /repos/eweOS/workflow/dispatches`, {
			event_type: eventType,
			client_payload: data,
		});
	}

	async commentIssue(issueNumber: number, comment: any) {
		return await (
			await this.init()
		).request(`POST /repos/eweOS/packages/issues/${issueNumber}/comments`, {
			body: comment,
		});
	}

	async labelIssue(issueNumber: number, labels: any) {
		return await (
			await this.init()
		).request(`POST /repos/eweOS/packages/issues/${issueNumber}/labels`, {
			labels: labels,
		});
	}

	async delabelIssue(issueNumber: number, label: string) {
		return await (await this.init()).request(`DELETE /repos/eweOS/packages/issues/${issueNumber}/labels/${encodeURI(label)}`);
	}

	async reactIssueComment(commentNumber: number, reaction: string) {
		return await (
			await this.init()
		).request(`POST /repos/eweOS/packages/issues/comments/${commentNumber}/reactions`, { content: reaction });
	}
}

export { GitHubApi };
