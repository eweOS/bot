import { sendPlainText, sendReactionSimple } from "../../api/send";

const mod = {
  command: "/test",
  func: mod_fn,
};

async function mod_fn(message, args) {
  await sendPlainText(message.chat.id, "test");
  await sendReactionSimple(message.chat.id, message.message_id);
}

export default mod;
