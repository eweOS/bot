class PkgInfoApi {
	async getPkgInfo(pkgName: string, repo: string = 'main', arch: string = 'x86_64') {
		return await fetch(`https://github.com/eweOS/workflow/raw/pkginfo-${arch}/${repo}/${pkgName}.json`);
	}
}

export default PkgInfoApi;
