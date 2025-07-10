import { OctokitResponse } from "@octokit/types";

class TelegramApiRequest {
	private botToken: string;
	private methodName: string;
	private params: any | null;
	constructor(botToken: string, methodName: string, params: any | null = null) {
		this.botToken = botToken;
		this.methodName = methodName;
		this.params = params;
	}
	async fetch() {
		let query = '';
		if (this.params) query = '?' + new URLSearchParams(this.params).toString();
		const fullURL = `https://api.telegram.org/bot${this.botToken}/${this.methodName}${query}`;
		const fetchResult = await fetch(fullURL);
		return await fetchResult.json();
	}
}

function escapeMarkdown(str: string, except = '') {
	const all = '_*[]()~`>#+-=|{}.!\\'.split('').filter((c) => !except.includes(c));
	const regExSpecial = '^$*+?.()|{}[]\\';
	const regEx = new RegExp('[' + all.map((c) => (regExSpecial.includes(c) ? '\\' + c : c)).join('') + ']', 'gim');
	return str.replace(regEx, '\\$&');
}

class TelegramApi {
	private botToken: string;
	constructor(botToken: string) {
		this.botToken = botToken;
	}
	async registerWebHook(webhookUrl: string, botSecret: string) {
		const j = {
			url: webhookUrl,
			secret_token: botSecret,
			allowed_updates: ['message'],
		};
		return await new TelegramApiRequest(this.botToken, 'setWebhook', j).fetch();
	}

	async unregisterWebHook() {
		return await new TelegramApiRequest(this.botToken, 'setWebhook', { url: '' }).fetch();
	}

	async sendRichText(
		chatId: number,
		text: string,
		replyId = null,
		markdown_mode = 'MarkdownV2',
		disable_link_preview = false,
		disable_notification = false,
	) {
		const j = {
			chat_id: chatId,
			text,
			parse_mode: markdown_mode,
			reply_to_message_id: replyId,
			link_preview_options: JSON.stringify({
				is_disabled: disable_link_preview,
			}),
			disable_notification: disable_notification,
		};
		return new TelegramApiRequest(this.botToken, 'sendMessage', j).fetch();
	}

	async sendPlainText(chatId: number, text: string, replyId: number | null = null) {
		const j = {
			chat_id: chatId,
			text,
			reply_to_message_id: replyId,
		};
		return new TelegramApiRequest(this.botToken, 'sendMessage', j).fetch();
	}

	async sendReaction(chatId: number, msgId: number, reactions = [{ type: 'emoji', emoji: '🎉' }]) {
		const j = {
			reaction: JSON.stringify(reactions),
			chat_id: chatId,
			message_id: msgId,
		};
		return new TelegramApiRequest(this.botToken, 'setMessageReaction', j).fetch();
	}

	async sendReactionSimple(chatId: number, msgId: number, reaction = '🎉') {
		return this.sendReaction(chatId, msgId, [{ type: 'emoji', emoji: reaction }]);
	}

	async sendInlineButtons(chatId: number, text: string, buttons: any) {
		const j = {
			chat_id: chatId,
			reply_markup: JSON.stringify({
				inline_keyboard: buttons,
			}),
			text,
		};
		return new TelegramApiRequest(this.botToken, 'sendMessage', j).fetch();
	}

	async sendInlineButton(chatId: number, text: string, button: any) {
		return this.sendInlineButtonRow(chatId, text, [button]);
	}

	async sendInlineButtonRow(chatId: number, text: string, buttonRow: any) {
		return this.sendInlineButtons(chatId, text, [buttonRow]);
	}

	async sendFetchResult(chatId: number, response: Response, replyId: number) {
		if (response.status != 204) {
			await this.sendPlainText(chatId, `${response.status}: ${response.statusText}`, replyId);
			await this.sendReactionSimple(chatId, replyId, '😢');
		} else if (replyId) await this.sendReactionSimple(chatId, replyId);
	}

	async sendDispatchResult(chatId: number, response: OctokitResponse<any, number>, replyId: number) {
		if (response.status != 204) {
			await this.sendReactionSimple(chatId, replyId, '😢');
		} else if (replyId) await this.sendReactionSimple(chatId, replyId);
	}

	async sendWorkflowResult(channel: number, status: any) {
		var txt = '';
		var emoji = 'ℹ️';
		let workflow = status.workflow_run;
		switch (workflow.conclusion) {
			case 'success': {
				emoji = '✅';
				break;
			}
			case 'failure': {
				emoji = '❌';
				break;
			}
		}
		let workflowid = workflow.path.replace('.yml', '').split('/').at(-1);
		txt += `<b>${emoji} Workflow <code>#${workflow.run_number}</code> @ <code>${workflowid}</code> ${workflow.conclusion}</b>\n\n`;
		txt += `<code>${workflow.display_title}</code>\n\n`;
		txt += `#${workflow.conclusion} #${workflowid}\n`;
		txt += `<a href="${workflow.html_url}">Workflow URL</a>`;
		return await this.sendRichText(channel, txt, null, 'html', true, workflow.conclusion == 'success');
	}

	async answerCallbackQuery(callbackQueryId: number, text: string | null = null) {
		const j = {
			callback_query_id: callbackQueryId,
			text: text || null,
		};
		return new TelegramApiRequest(this.botToken, 'answerCallbackQuery', j).fetch();
	}
}

export { escapeMarkdown, TelegramApi };
