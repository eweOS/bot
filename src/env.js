import * as process from "node:process";

async function setEnv(env) {
  process.env.ENV_BOT_SECRET ??= env.ENV_BOT_SECRET;
  process.env.ENV_BOT_TOKEN ??= env.ENV_BOT_TOKEN;
  process.env.ENV_GITHUB_WEBHOOK_TOKEN ??= env.ENV_GITHUB_WEBHOOK_TOKEN;
  process.env.ENV_BOT_WORKFLOW_CHANNEL ??= env.ENV_BOT_WORKFLOW_CHANNEL;
  process.env.ENV_OBS_TOKEN ??= env.ENV_OBS_TOKEN;
  process.env.ENV_GITHUB_APP_ID ??= env.ENV_GITHUB_APP_ID;
  process.env.ENV_GITHUB_APP_KEY ??= env.ENV_GITHUB_APP_KEY;
  process.env.ENV_GITHUB_APP_INSTALL ??= env.ENV_GITHUB_APP_INSTALL;
}

export { setEnv };
