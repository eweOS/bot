import { setEnv } from "./env";
import { urlrouter } from "./urlrouter";

export default {
  async fetch(request, env, ctx) {
    setEnv(env);
    return urlrouter(request, ctx);
  },
};
