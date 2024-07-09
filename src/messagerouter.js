import * as process from "node:process";
import modules from "./modules";
import { checkmessage } from "./filter";
import { sendPlainText } from "./api/send";

async function commandrouter(message) {
  const command = message.text.split(" ")[0];
  let command_args = null;
  if (message.text.trim() !== command)
    command_args = message.text.slice(command.length + 1).trim();
  if (command in modules) {
    const exec_cmd_fn = modules[command].func;
    if ("filter" in modules[command])
      if (modules[command].filter(command_args))
        await exec_cmd_fn(message, command_args);
      else await exec_cmd_fn(message);
  }
}

async function messagetyperouter(update) {
  if ("message" in update) {
    if (checkmessage(update.message)) await commandrouter(update.message);
  }
}

async function messagerouter(request, ctx) {
  if (
    request.headers.get("X-Telegram-Bot-Api-Secret-Token") !==
    process.env.ENV_BOT_SECRET
  ) {
    return new Response("Unauthorized", { status: 403 });
  }

  const update = await request.json();
  ctx.waitUntil(messagetyperouter(update));

  return new Response("Ok");
}

export { messagerouter };
