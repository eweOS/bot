import { registerWebhook, unRegisterWebhook } from "./api/webhook";
import { messagerouter } from "./router/messagerouter";
import { webhookrouter } from "./router/webhookrouter";

function urlrouter(request, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  switch (pathname) {
    case "/endpoint":
      return messagerouter(request, ctx);

    case "/registerWebhook":
      return registerWebhook(request, url, "/endpoint");

    case "/unRegisterWebhook":
      return unRegisterWebhook(request);

    case "/github":
      return webhookrouter(request);

    default:
      return new Response("No handler for this request");
  }
}

export { urlrouter };
