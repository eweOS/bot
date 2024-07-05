import { sendPlainText } from "../api/send";

const mod = {
  command: "/test",
  func: mod_fn,
};

async function mod_fn(message, args) {
  await sendPlainText(message.chat.id, "test");
}

export default mod;
