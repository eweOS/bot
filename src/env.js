import * as process from "node:process";

function setEnv(env) {
  process.env.ENV_BOT_SECRET ??= env.ENV_BOT_SECRET;
  process.env.ENV_BOT_TOKEN ??= env.ENV_BOT_TOKEN;
  process.env.ENV_GITHUB_TOKEN ??= env.ENV_GITHUB_TOKEN;
}

export { setEnv };
