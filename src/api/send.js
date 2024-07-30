import { apiUrl } from "./webhook";

async function sendRichText(
  chatId,
  text,
  replyId = null,
  markdown_mode = "MarkdownV2",
  disable_link_preview = false,
  disable_notification = false
) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: markdown_mode,
        reply_to_message_id: replyId,
        link_preview_options: JSON.stringify({
          is_disabled: disable_link_preview,
        }),
        disable_notification: disable_notification,
      })
    )
  ).json();
}

async function sendPlainText(chatId, text, replyId = null) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        text,
        reply_to_message_id: replyId,
      })
    )
  ).json();
}

async function sendReactionSimple(chatId, msgId, reaction = "🎉") {
  return sendReaction(chatId, msgId, [{ type: "emoji", emoji: reaction }]);
}

async function sendReaction(
  chatId,
  msgId,
  reactions = [{ type: "emoji", emoji: "🎉" }]
) {
  return (
    await fetch(
      apiUrl("setMessageReaction", {
        reaction: JSON.stringify(reactions),
        chat_id: chatId,
        message_id: msgId,
      })
    )
  ).json();
}

function escapeMarkdown(str, except = "") {
  const all = "_*[]()~`>#+-=|{}.!\\"
    .split("")
    .filter((c) => !except.includes(c));
  const regExSpecial = "^$*+?.()|{}[]\\";
  const regEx = new RegExp(
    "[" +
      all.map((c) => (regExSpecial.includes(c) ? "\\" + c : c)).join("") +
      "]",
    "gim"
  );
  return str.replace(regEx, "\\$&");
}

async function sendInlineButton(chatId, text, button) {
  return sendInlineButtonRow(chatId, text, [button]);
}

async function sendInlineButtonRow(chatId, text, buttonRow) {
  return sendInlineButtons(chatId, text, [buttonRow]);
}

async function sendFetchResult(chatId, response, replyId = null) {
  if (response.status != 204) {
    await sendPlainText(
      chatId,
      `${response.status}: ${response.statusText}`,
      replyId
    );
    await sendReactionSimple(chatId, replyId, "😢");
  } else if (replyId) await sendReactionSimple(chatId, replyId);
}

async function sendInlineButtons(chatId, text, buttons) {
  return (
    await fetch(
      apiUrl("sendMessage", {
        chat_id: chatId,
        reply_markup: JSON.stringify({
          inline_keyboard: buttons,
        }),
        text,
      })
    )
  ).json();
}

async function answerCallbackQuery(callbackQueryId, text = null) {
  const data = {
    callback_query_id: callbackQueryId,
  };
  if (text) {
    data.text = text;
  }
  return (await fetch(apiUrl("answerCallbackQuery", data))).json();
}

export {
  sendPlainText,
  escapeMarkdown,
  sendInlineButton,
  sendInlineButtonRow,
  sendInlineButtons,
  answerCallbackQuery,
  sendFetchResult,
  sendReaction,
  sendReactionSimple,
  sendRichText,
};
