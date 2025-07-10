let modules: Record<string, EurMod> = {};

import EurMod from './base';
import search_mod from './search';
import info_mod from './info';

function add_mod(mod: EurMod) {
	modules[mod.type] = mod;
}

add_mod(search_mod);
add_mod(info_mod);

export default modules;
