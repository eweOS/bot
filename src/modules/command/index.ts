let modules: Record<string, CommandMod> = {};

import newpkg_mod from "./newpkg";
import bumprel_mod from "./bumprel";
import bumpver_mod from "./bumpver";
import pkginfo_mod from "./pkginfo";
import recheck_mod from "./recheck";
import CommandMod from "./base";

function add_mod(mod: CommandMod) {
  modules[mod.command] = mod;
}

add_mod(newpkg_mod);
add_mod(bumprel_mod);
add_mod(bumpver_mod);
add_mod(pkginfo_mod);
add_mod(recheck_mod);

export default modules;
