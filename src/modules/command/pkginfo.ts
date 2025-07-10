import { Context } from 'hono';
import { testarg_pkgname } from '../../utils/cmdargs';
import CommandMod from './base';
import { TelegramApi } from '../../api/telegram';
import PkgInfoApi from '../../api/pkginfo';

const mod: CommandMod = {
	command: '/pkginfo',
	func: mod_fn,
	filter: testarg_pkgname,
	context_filter: (msg) => {
		return msg.chat.type == 'private';
	},
};

async function mod_fn(c: Context, message: any, args: any) {
	const pkgInfoApi = new PkgInfoApi();
	const res = await pkgInfoApi.getPkgInfo(args);
	const telegramApi = new TelegramApi(c.env.ENV_BOT_TOKEN);
	if (res.status == 404) {
		await telegramApi.sendReactionSimple(message.chat.id, message.message_id, '🤷');
		return;
	}
	const resjson: any = await res.json();
	var replytext = '';
	Object.keys(resjson).forEach(function (k, v) {
		replytext += `*${k}*: \`${resjson[k]}\`\n`;
	});
	//replytext = escapeMarkdown(replytext);
	await telegramApi.sendRichText(message.chat.id, replytext, message.message_id);
}

export default mod;
