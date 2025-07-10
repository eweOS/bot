import { Context } from 'hono';
import DispatchMod from '../base';
import { TelegramApi } from '../../../api/telegram';

const mod: DispatchMod = {
	event: 'workflow_run',
	repos: ['eweOS/workflow'],
	func: mod_fn,
};

const ignored_workflows = ['pr_closed.yml'];

async function mod_fn(c: Context, payload: any) {
	if (payload.action != 'completed') return;

	let workflow = payload.workflow_run;
	let workflowid = workflow.path.split('/').at(-1);

	if (ignored_workflows.includes(workflowid)) return;

	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	await telegramApi.sendWorkflowResult(c.env.ENV_BOT_WORKFLOW_CHANNEL, payload);
}

export default mod;
