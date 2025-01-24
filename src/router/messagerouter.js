import * as process from "node:process";
import modules from "../modules/workflow";
import { checkmessage } from "../filter";
import { sendReactionSimple } from "../api/send";

async function commandrouter(message) {
  if (!message.text.startsWith("/")) return;
  var command = message.text.split(" ")[0];
  var standard_command = command.replace("@eweos_bot", "");
  let command_args = null;
  if (message.text.trim() !== command)
    command_args = message.text.slice(command.length + 1).trim();
  if (standard_command in modules) {
    const exec_cmd_fn = modules[standard_command].func;
    if ("context_filter" in modules[standard_command])
      if (!modules[standard_command].context_filter(message)) {
        await sendReactionSimple(message.chat.id, message.message_id, "🙊");
        return;
      }
    if ("filter" in modules[standard_command])
      if (!modules[standard_command].filter(command_args)) {
        await sendReactionSimple(message.chat.id, message.message_id, "🤨");
        return;
      }
    await exec_cmd_fn(message, command_args);
  } else await sendReactionSimple(message.chat.id, message.message_id, "🤷");
}

async function messagetyperouter(update) {
  if ("message" in update) {
    if (! ("text" in update.message)) return;
    if (checkmessage(update.message)) await commandrouter(update.message);
    else
      await sendReactionSimple(
        update.message.chat.id,
        update.message.message_id,
        "🤡"
      );
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
