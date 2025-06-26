import { jsonResponse } from "./response";

async function eurResponse(results) {
  var resp = eurBaseResponse("string");
  resp.resultcount = results.length;
  resp.results = results;
  return jsonResponse(resp);
}

const demopkg_brief = {
  ID: 0,
  Name: "example-package",
  Description: "string",
  PackageBaseID: 0,
  PackageBase: "example-package-base",
  Maintainer: "string",
  NumVotes: 0,
  Popularity: 0,
  FirstSubmitted: 0,
  LastModified: 0,
  OutOfDate: 0,
  Version: "0.0.1",
  URLPath: "example-package-urlpath",
  URL: "example-package-url",
};

const demopkg = {
  ID: 0,
  Name: "example-package",
  Description: "string",
  PackageBaseID: 0,
  PackageBase: "example-package-base",
  Maintainer: "string",
  NumVotes: 0,
  Popularity: 0,
  FirstSubmitted: 0,
  LastModified: 0,
  OutOfDate: 0,
  Version: "0.0.1",
  URLPath: "example-package-urlpath",
  URL: "example-package-url",
  Submitter: "string",
  License: ["string"],
  Depends: ["musl"],
  MakeDepends: ["musl"],
  OptDepends: ["musl"],
  CheckDepends: ["musl"],
  Provides: ["example-package"],
  Conflicts: ["example-package-conflicts"],
  Replaces: ["example-package-replaces"],
  Groups: ["example-packages"],
  Keywords: ["example-package"],
  CoMaintainers: ["string"],
};

function eurBaseResponse(resp_type) {
  return {
    resultcount: 0,
    results: [],
    type: resp_type,
    version: 5,
  };
}

async function eurErrResponse(str) {
  var resp = eurBaseResponse("error");
  resp.error = str;
  return jsonResponse(resp);
}

export { eurResponse, eurErrResponse, demopkg, demopkg_brief };
