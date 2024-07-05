import { sendFetchResult } from "../api/send";
import { dispatchWorkflow } from "../api/github";
import { testarg_pkgname } from "../cmdargs";

const mod = {
  command: "/newpkg",
  func: mod_fn,
  filter: testarg_pkgname,
};

async function mod_fn(message, args) {
  const res = await dispatchWorkflow("create_package.yml", {
    package: args,
  });
  await sendFetchResult(message.chat.id, res, message.message_id);
}

export default mod;
