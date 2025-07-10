import { Context } from 'hono';

export default interface EurMod {
	type: string;
	func(c: Context, preload: FormData): Promise<Response>;
}
