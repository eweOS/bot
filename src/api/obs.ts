class OBSApi {
	private token?: string;
	private pass?: string;
	private endpoint: string = 'https://os-build.ewe.moe';
	constructor(token?: string, pass?: string) {
		this.token = token;
		this.pass = pass;
	}

	private authHeader(preferBasic = false) {
		if (preferBasic && this.pass) return `Basic ${this.pass}`;
		if (this.token) return `Token ${this.token}`;
		if (this.pass) return `Basic ${this.pass}`;
		return '';
	}

	async dispatchProject(projectName: string, pkgName: string) {
		return await fetch(`${this.endpoint}/trigger/runservice?project=${projectName}&package=${pkgName}`, {
			method: 'POST',
			headers: {
				Authorization: this.authHeader(),
				'User-Agent': 'request',
			},
		});
	}

	async createPackage(projectName: string, pkgName: string) {
		const meta = `<package name="${pkgName}" project="${projectName}">
  <title/>
  <description/>
  <scmsync>https://github.com/eweOS/packages#${pkgName}</scmsync>
</package>`;
		return await fetch(`${this.endpoint}/source/${projectName}/${pkgName}/_meta`, {
			method: 'PUT',
			headers: {
				Authorization: this.authHeader(true),
				'Content-Type': 'application/xml',
				'User-Agent': 'request',
			},
			body: meta,
		});
	}
}

export default OBSApi;
