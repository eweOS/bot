import { Context } from 'hono';

export default interface CommandMod {
	command: string;
	filter?(args: string): boolean;
	context_filter?(msg: any): boolean;
	func(c: Context, message: any, args: any): Promise<void>;
}
