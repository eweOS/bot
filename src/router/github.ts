import { Hono } from 'hono';
import HonoEnv from '../bindings';
import { checkwebhook } from '../filters';

const mod = new Hono<HonoEnv>({ strict: false });

import modules from '../modules/dispatch';
import { HTTPException } from 'hono/http-exception';

mod.use(async (c, next) => {
	if (!(await checkwebhook(c))) throw new HTTPException(401, { message: 'Invalid request' });
	else await next();
});

mod.post('/', async (c) => {
	const payload = await c.req.json();
	const hooktype = c.req.header('X-GitHub-Event')!;
	if (hooktype in modules) {
		if (!('repository' in payload)) {
			await modules[hooktype].func(c, payload);
			return c.json({ message: 'Workflow success!' });
		} else if (modules[hooktype].repos.includes(payload.repository.full_name)) {
			await modules[hooktype].func(c, payload);
			return c.json({ message: 'Workflow success!' });
		}
	}
	throw new HTTPException(401, { message: 'Unexpected behavior' });
});

// export { webhookrouter };

export default mod;
