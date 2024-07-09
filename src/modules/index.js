let modules = {};

import test_mod from "./test";
import newpkg_mod from "./newpkg";
import bumprel_mod from "./bumprel";
import bumpver_mod from "./bumpver";

function add_mod(mod) {
  modules[mod.command] = mod;
}

add_mod(test_mod);
add_mod(newpkg_mod);
add_mod(bumprel_mod);
add_mod(bumpver_mod);

export default modules;
