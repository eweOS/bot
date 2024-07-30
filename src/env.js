import * as process from "node:process";

function setEnv(env) {
  process.env.ENV_BOT_SECRET ??= env.ENV_BOT_SECRET;
  process.env.ENV_BOT_TOKEN ??= env.ENV_BOT_TOKEN;
  process.env.ENV_GITHUB_TOKEN ??= env.ENV_GITHUB_TOKEN;
  process.env.ENV_GITHUB_WEBHOOK_TOKEN ??= env.ENV_GITHUB_WEBHOOK_TOKEN;
  process.env.ENV_BOT_WORKFLOW_CHANNEL ??= env.ENV_BOT_WORKFLOW_CHANNEL;
  process.env.ENV_OBS_TOKEN ??= env.ENV_OBS_TOKEN;
}

export { setEnv };
