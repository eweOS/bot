import EurDB from '../utils/eurdb';

class EurBaseResponse {
	resultcount: number;
	results: Record<string, any>;
	type: string;
	version: number;
	constructor(resptype: string) {
		this.type = resptype;
		this.version = 5;
		this.results = [];
		this.resultcount = 0;
	}
	export(): Record<string, any> {
		return {
			resultcount: this.resultcount,
			results: this.results,
			type: this.type,
			version: this.version,
		};
	}
}

class EurQueryResponse extends EurBaseResponse {
	constructor(results: Record<string, any> = []) {
		super('string');
		this.results = results;
		this.resultcount = results.length;
	}
}

class EurErrResponse extends EurBaseResponse {
	error: string;
	constructor(errmsg: string = '') {
		super('error');
		this.error = errmsg;
	}
	export() {
		const a: Record<string, any> = super.export();
		a.error = this.error;
		return a;
	}
}

class EurApi {
	private eurDB: EurDB;
	constructor(db: D1Database) {
		this.eurDB = new EurDB(db);
	}
	async search(searchString: string, order: string = 'name-desc') {
		const results = await this.eurDB.search(searchString, order);
		return new EurQueryResponse(results);
	}

	async info(pkgNames: string[]) {
		const results = await this.eurDB.select(pkgNames);
		return new EurQueryResponse(results);
	}
}

const demopkg_brief = {
	ID: 0,
	Name: 'example-package',
	Description: 'string',
	PackageBaseID: 0,
	PackageBase: 'example-package-base',
	Maintainer: 'string',
	NumVotes: 0,
	Popularity: 0,
	FirstSubmitted: 0,
	LastModified: 0,
	OutOfDate: 0,
	Version: '0.0.1',
	URLPath: 'example-package-urlpath',
	URL: 'example-package-url',
};

const demopkg = {
	ID: 0,
	Name: 'example-package',
	Description: 'string',
	PackageBaseID: 0,
	PackageBase: 'example-package-base',
	Maintainer: 'string',
	NumVotes: 0,
	Popularity: 0,
	FirstSubmitted: 0,
	LastModified: 0,
	OutOfDate: 0,
	Version: '0.0.1',
	URLPath: 'example-package-urlpath',
	URL: 'example-package-url',
	Submitter: 'string',
	License: ['string'],
	Depends: ['musl'],
	MakeDepends: ['musl'],
	OptDepends: ['musl'],
	CheckDepends: ['musl'],
	Provides: ['example-package'],
	Conflicts: ['example-package-conflicts'],
	Replaces: ['example-package-replaces'],
	Groups: ['example-packages'],
	Keywords: ['example-package'],
	CoMaintainers: ['string'],
};

export default EurApi;

export { EurErrResponse, EurQueryResponse };
