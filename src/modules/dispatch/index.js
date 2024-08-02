let modules = {};

import workflow_mod from "./workflow_run";
import pull_mod from "./pull_request";
import push_mod from "./push";

function add_mod(mod) {
  modules[mod.event] = mod;
}

add_mod(workflow_mod);
add_mod(pull_mod);
add_mod(push_mod);

export default modules;
