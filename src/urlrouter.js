import { registerWebhook, unRegisterWebhook } from "./api/webhook";
import { messagerouter } from "./router/messagerouter";
import { webhookrouter } from "./router/webhookrouter";
import { eurrouter } from "./router/eurrouter";
import { defaultrouter } from "./router/default";

function urlrouter(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (url.host == "os-eur.ewe.moe") return eurrouter(request, env);
  switch (pathname) {
    case "/endpoint":
      return messagerouter(request, ctx);

    case "/registerWebhook":
      return registerWebhook(request, url, "/endpoint");

    case "/unRegisterWebhook":
      return unRegisterWebhook(request);

    case "/github":
      return webhookrouter(request);
  }

  return defaultrouter(request);
}

export { urlrouter };
