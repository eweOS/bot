import { getPackagePR } from "../../api/github";
import { testarg_number } from "../../utils/cmdargs";
import dispatch_mod from "../dispatch/pull_request.js";
import { sendReactionSimple } from "../../api/send";

const mod = {
  command: "/recheck",
  func: mod_fn,
  filter: testarg_number,
};

async function mod_fn(message, args) {
  const res = await getPackagePR(args);
  if (res.status == 404) {
    await sendReactionSimple(message.chat.id, message.message_id, "🤷");
    return;
  }
  const payload = res.data;
  if (payload.state == "open" && !payload.draft) {
    await dispatch_mod.func({
      action: "synchronize",
      repository: { full_name: "eweOS/packages" },
      pull_request: payload,
    });
    await sendReactionSimple(message.chat.id, message.message_id, "🎉");
  } else await sendReactionSimple(message.chat.id, message.message_id, "🥱");
}

export default mod;
