import * as process from "node:process";

async function dispatchOBS(pkgname) {
  return await fetch(
    "https://os-build.ewe.moe/trigger/runservice?project=eweOS:Main&package=" +
      pkgname,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.ENV_OBS_TOKEN}`,
        "User-Agent": "request",
      },
    }
  );
}

export { dispatchOBS };
