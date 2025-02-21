import { dispatchOBS } from "../../../api/obs";
import { dispatchRepository } from "../../../api/github";

const mod = {
  event: "push",
  repos: ["eweOS/packages"],
  func: mod_fn,
};

async function mod_fn(payload) {
  let branch = payload.ref;

  if (!branch) return; // No branch specified

  if (!branch.startsWith("refs/heads/")) return; // Invalid tag

  const pkg_name = branch.replace("refs/heads/", "");
  if (pkg_name.startsWith("_")) return; // Ignored special branch

  if (!payload.created) {
    await dispatchOBS(pkg_name);
    await dispatchRepository("push", { pkg: pkg_name });
  } else {
    await dispatchRepository("creation", { pkg: pkg_name });
  }
}

export default mod;
