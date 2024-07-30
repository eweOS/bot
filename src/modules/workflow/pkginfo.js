import { sendRichText, sendReactionSimple } from "../../api/send";
import { getpkginfo } from "../../api/http";
import { testarg_pkgname } from "../../utils/cmdargs";

const mod = {
  command: "/pkginfo",
  func: mod_fn,
  filter: testarg_pkgname,
  context_filter: (msg) => {
    return msg.chat.type == "private";
  },
};

async function mod_fn(message, args) {
  const res = await getpkginfo(args);
  if (res.status == 404) {
    await sendReactionSimple(message.chat.id, message.message_id, "🤷");
    return;
  }
  const resjson = await res.json();
  var replytext = "";
  Object.keys(resjson).forEach(function (k, v) {
    replytext += `*${k}*: \`${resjson[k]}\`\n`;
  });
  //replytext = escapeMarkdown(replytext);
  await sendRichText(message.chat.id, replytext, message.message_id);
}

export default mod;
