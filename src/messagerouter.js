import * as process from "node:process";
import modules from "./modules";
import { checkmessage } from "./filter";
import { sendReactionSimple } from "./api/send";

async function commandrouter(message) {
  var command = message.text.split(" ")[0];
  var standard_command = command.replace("@eweos_bot", "");
  let command_args = null;
  if (message.text.trim() !== command)
    command_args = message.text.slice(command.length + 1).trim();
  if (standard_command in modules) {
    const exec_cmd_fn = modules[standard_command].func;
    if ("filter" in modules[standard_command]) {
      if (modules[standard_command].filter(command_args))
        await exec_cmd_fn(message, command_args);
      else await sendReactionSimple(message.chat.id, message.message_id, "🤨");
    } else await exec_cmd_fn(message, command_args);
  } else await sendReactionSimple(message.chat.id, message.message_id, "🤷");
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
