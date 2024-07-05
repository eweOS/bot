import * as process from "node:process";

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

export { dispatchWorkflow };
