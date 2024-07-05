import { setEnv } from "./env";
import { urlrouter } from "./urlrouter";

export default {
  async fetch(request, env, ctx) {
    setEnv(env);
    const url = new URL(request.url);
    return urlrouter(request, ctx);
  },
};
