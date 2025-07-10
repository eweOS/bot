import { Context } from 'hono';
import EurApi, { EurQueryResponse } from '../../api/eur';
import EurMod from './base';

const mod: EurMod = {
	type: 'search',
	func: mod_fn,
};

async function mod_fn(c: Context, preload: FormData) {
	if (!preload.has('arg')) return c.json(new EurQueryResponse([]).export());
	const searchString = preload.get('arg') as string;
	return c.json((await new EurApi(c.env.EUR_DB).search(searchString, preload.get('by') as string)).export());
}

export default mod;
