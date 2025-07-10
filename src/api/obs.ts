class OBSApi {
	private token: string;
	constructor(token: string) {
		this.token = token;
	}
	async dispatchProject(projectName: string, pkgName: string) {
		return await fetch(`https://os-build.ewe.moe/trigger/runservice?project=${projectName}&package=${pkgName}`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${this.token}`,
				'User-Agent': 'request',
			},
		});
	}
}

export default OBSApi;
