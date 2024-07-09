import { sendFetchResult } from "../api/send";
import { dispatchWorkflow } from "../api/github";
import {
  split_command_once,
  testarg_pkgname,
  testarg_string_not_quoted,
} from "../cmdargs";

const mod = {
  command: "/bumpver",
  func: mod_fn,
  filter: mod_filter,
};

function mod_filter(args) {
  if (!args) return false;
  const { first: pkgname, remains: version } = split_command_once(args);
  if (!testarg_pkgname(pkgname)) return false;
  if (!version) return false;
  if (!testarg_string_not_quoted(version)) return false;
  return true;
}

async function mod_fn(message, args) {
  const { first: pkgname, remains: version } = split_command_once(args);
  const res = await dispatchWorkflow("bump_ver.yml", {
    package: pkgname,
    version: version,
  });
  await sendFetchResult(message.chat.id, res, message.message_id);
}

export default mod;
