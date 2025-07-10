type Bindings = Record<string, never>;

type Variables = {
	ENV_BOT_SECRET: string;
	ENV_BOT_WORKFLOW_CHANNEL: string;
	ENV_GITHUB_APP_ID: string;
	ENV_GITHUB_APP_INSTALL: string;
};

type HonoEnv = {
	Bindings: Bindings;
	Variables: Variables;
};

export default HonoEnv;
