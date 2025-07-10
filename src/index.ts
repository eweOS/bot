import { Hono } from 'hono';
import HonoEnv from './bindings';
import router_github from './router/github';
import router_telegram from './router/telegram';
import router_eur from './router/eur';
import router_telegram_register from './router/telegram_register';

const app = new Hono<HonoEnv>({ strict: false });

app.route('/github', router_github);
app.route('/endpoint', router_telegram);
app.route('/eur', router_eur);
app.route('/', router_telegram_register);

export default app;
