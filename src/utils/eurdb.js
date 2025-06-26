const fields_brief = [
  "ID",
  "Name",
  "Description",
  "PackageBaseID",
  "PackageBase",
  "Maintainer",
  "NumVotes",
  "Popularity",
  "FirstSubmitted",
  "LastModified",
  "OutOfDate",
  "Version",
  "URLPath",
  "URL",
];

const index_keys = [
  "Name",
  "PackageBase",
  "Description",
  "Keywords",
  "Groups ",
];

const fields_extra = [
  "License",
  "Depends",
  "MakeDepends",
  "OptDepends",
  "CheckDepends",
  "Provides",
  "Conflicts",
  "Replaces",
  "Groups",
  "Keywords",
  "CoMaintainers",
];

function progress_result(rres) {
  var res = rres.map((x) => {
    var y = Object.fromEntries(Object.entries(x).filter(([_, v]) => v != null));
    for (const k of fields_extra) {
      if (Object.keys(res).includes(k)) {
        res[k] = Array.from(res[k]);
      }
    }
  });
  return res;
}

async function eurSearchDemo(search, db) {
  const { results } = await db
    .prepare(
      `SELECT ${fields_brief.join(",")} FROM packages where Name == (select Name from packages_search where ${index_keys
        .map((x) => `${x} match "${search}"`)
        .join(" OR ")})`,
    )
    .all();
  return results;
}

async function eurInfoDemo(db) {
  const { results } = await db
    .prepare(
      `SELECT ${fields_brief.concat(fields_extra).join(",")} FROM packages`,
    )
    .all();
  return results;
}

export { eurSearchDemo };
