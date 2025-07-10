let modules: Record<string, DispatchMod> = {};

import workflow_mod from "./workflow/workflow_run";

import pull_mod from "./packages/pull_request";
import push_mod from "./packages/push";
import issues_mod from "./packages/issues";
import issue_comment_mod from "./packages/issue_comment";
import DispatchMod from "./base";

function add_mod(mod: DispatchMod) {
  modules[mod.event] = mod;
}

add_mod(workflow_mod);

add_mod(pull_mod);
add_mod(push_mod);
add_mod(issues_mod);
add_mod(issue_comment_mod);

export default modules;
