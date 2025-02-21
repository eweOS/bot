import * as process from "node:process";
import { App } from "octokit";

async function initOctokit() {
  const app = new App({
    appId: process.env.ENV_GITHUB_APP_ID,
    privateKey: process.env.ENV_GITHUB_APP_KEY,
  });
  return await app.getInstallationOctokit(process.env.ENV_GITHUB_APP_INSTALL);
}

async function getPackagePR(pr_id) {
  return await (
    await initOctokit()
  ).request(`GET /repos/eweOS/packages/pulls/${pr_id}`);
}

async function dispatchWorkflow(workflow, data) {
  return await (
    await initOctokit()
  ).request(
    `POST /repos/eweOS/workflow/actions/workflows/${workflow}/dispatches`,
    {
      ref: "master",
      inputs: data,
    },
  );
}

async function dispatchRepository(event_type, data) {
  return await (
    await initOctokit()
  ).request(`POST /repos/eweOS/workflow/dispatches`, {
    event_type: event_type,
    client_payload: data,
  });
}

async function commentIssue(issue_number, comment) {
  return await (
    await initOctokit()
  ).request(`POST /repos/eweOS/packages/issues/${issue_number}/comments`, {
    body: comment,
  });
}

async function labelIssue(issue_number, labels) {
  return await (
    await initOctokit()
  ).request(`POST /repos/eweOS/packages/issues/${issue_number}/labels`, {
    labels: labels,
  });
}

async function delabelIssue(issue_number, label) {
  return await (
    await initOctokit()
  ).request(
    `DELETE /repos/eweOS/packages/issues/${issue_number}/labels/${encodeURI(label)}`,
  );
}

async function reactIssueComment(comment_number, reaction) {
  return await (
    await initOctokit()
  ).request(
    `POST /repos/eweOS/packages/issues/comments/${comment_number}/reactions`,
    { content: reaction },
  );
}

export {
  dispatchWorkflow,
  dispatchRepository,
  getPackagePR,
  commentIssue,
  labelIssue,
  delabelIssue,
  reactIssueComment,
};
