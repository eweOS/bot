import { Context } from 'hono';
import EurApi, { EurQueryResponse } from '../../api/eur';
import EurMod from './base';

const mod: EurMod = {
	type: 'info',
	func: mod_fn,
};

async function mod_fn(c: Context, preload: FormData) {
	if (!preload.has('arg') && !preload.has('arg[]')) return c.json(new EurQueryResponse([]).export());
	const pkgNames = preload.getAll(preload.has('arg[]') ? 'arg[]' : 'arg') as string[];
	return c.json((await new EurApi(c.env.EUR_DB).info(pkgNames)).export());
}

export default mod;
