import { sendFetchResult } from "../../api/send";
import { dispatchWorkflow } from "../../api/github";
import {
  split_command_once,
  testarg_pkgname,
  testarg_string_not_quoted,
} from "../../utils/cmdargs";

const mod = {
  command: "/bumprel",
  func: mod_fn,
  filter: mod_filter,
};

function mod_filter(args) {
  if (!args) return false;
  const { first: pkgname, remains: desc } = split_command_once(args, "\n");
  if (!testarg_pkgname(pkgname)) return false;
  if (desc) if (!testarg_string_not_quoted(desc)) return false;
  return true;
}

async function mod_fn(message, args) {
  const { first: pkgname, remains: desc } = split_command_once(args, "\n");
  const res = await dispatchWorkflow("bump_rel.yml", {
    package: pkgname,
    reason: desc ? desc : "automated by eweos_bot",
  });
  await sendFetchResult(message.chat.id, res, message.message_id);
}

export default mod;
