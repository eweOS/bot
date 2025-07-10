import { Context } from 'hono';

export default interface DispatchMod {
	event: string;
	repos: string[];
	func(c: Context, payload: any): Promise<void>;
}
