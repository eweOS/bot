class EurDB {
	static fields_brief = [
		'ID',
		'Name',
		'Description',
		'PackageBaseID',
		'PackageBase',
		'Maintainer',
		'NumVotes',
		'Popularity',
		'FirstSubmitted',
		'LastModified',
		'OutOfDate',
		'Version',
		'URLPath',
		'URL',
	];

	static index_keys = ['Name', 'PackageBase', 'Description', 'Keywords', 'Groups '];

	static fields_extra = [
		'License',
		'Depends',
		'MakeDepends',
		'OptDepends',
		'CheckDepends',
		'Provides',
		'Conflicts',
		'Replaces',
		'Groups',
		'Keywords',
		'CoMaintainers',
	];

	static fields_all() {
		return this.fields_brief.concat(this.fields_extra);
	}

	orderby: Record<string, string> = {
		name: 'order by Name',
		'name-desc': 'order by Name desc',
	};

	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	progress_result(records: Record<string, any>[]) {
		return records.map((record: Record<string, any>) => {
			var y = Object.fromEntries(Object.entries(record).filter(([_, v]) => v != null));
			for (const k of EurDB.fields_extra) {
				if (Object.keys(y).includes(k)) {
					y[k] = Array.from(y[k]);
				}
			}
			return y;
		});
	}

	async select(pkgNames: string[]) {
		const { results } = await this.db
			.prepare(`SELECT ${EurDB.fields_all().join(',')} FROM packages where ${pkgNames.map((x) => `Name == '${x}'`).join(' OR ')}`)
			.all();
		return this.progress_result(results);
	}

	async search(searchString: string, order = 'name-desc') {
		const { results } = await this.db
			.prepare(
				`SELECT ${EurDB.fields_brief.join(',')} FROM packages where Name == (select Name from packages_search where ${EurDB.index_keys
					.map((x) => `${x} match '"${searchString}"'`)
					.join(' OR ')}) ${this.orderby?.[order]}`,
			)
			.all();
		return results;
	}
}

export default EurDB;
