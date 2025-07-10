import { urlrouter } from "./urlrouter";

export default {
  async fetch(request, env, ctx) {
    return urlrouter(request, ctx);
  },
};
