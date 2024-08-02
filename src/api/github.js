import * as process from "node:process";

async function getPackagePR(pr_id) {
  return await fetch("https://api.github.com/repos/eweOS/packages/pulls/" + pr_id,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.ENV_GITHUB_TOKEN}`,
        "User-Agent": "request",
      },
    }
  )
}

async function dispatchWorkflow(workflow, data) {
  return await fetch(
    `https://api.github.com/repos/eweOS/workflow/actions/workflows/${workflow}/dispatches`,
    {
      body: JSON.stringify({
        ref: "master",
        inputs: data,
      }),
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.ENV_GITHUB_TOKEN}`,
        "User-Agent": "request",
      },
    }
  );
}

async function dispatchRepository(event_type, data) {
  return await fetch("https://api.github.com/repos/eweOS/workflow/dispatches", {
    body: JSON.stringify({
      event_type: event_type,
      client_payload: data,
    }),
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.ENV_GITHUB_TOKEN}`,
      "User-Agent": "request",
    },
  });
}

export { dispatchWorkflow, dispatchRepository, getPackagePR };
