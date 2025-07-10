import { Hono } from 'hono';
import HonoEnv from '../bindings';
import { HTTPException } from 'hono/http-exception';
import modules from '../modules/eur';
import { EurErrResponse } from '../api/eur';

const mod = new Hono<HonoEnv>({ strict: false });

mod.post('/rpc', async (c) => {
	if (!c.req.header('content-type')?.includes('form')) throw new HTTPException(400, { message: 'Invalid request' });
	const formData = await c.req.formData();
	const rpcType = formData.get('type') as string;
	if (rpcType in modules) return modules[rpcType].func(c, formData);
	return c.json(new EurErrResponse('Incorrect request type specified.').export());
});

export default mod;
