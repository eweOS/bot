import { eurErrResponse } from "../api/eur";
import modules from "../modules/eur";

async function eurrouter_rpc(request, env) {
  if (request.headers.get("content-type").includes("form")) {
    const formData = await request.formData();
    const data = {};
    for (const entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }
    for (const m of modules) {
      if (data.type === m.type) return m.func(data, env);
    }
  }
  return eurErrResponse("Incorrect request type specified.");
}

async function eurrouter_git(request, env) {
  return eurErrResponse("Incorrect request type specified.");
}

async function eurrouter(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname == "/.rpc") return eurrouter_rpc(request, env);
  if (/^\\.+/.test(pathname)) return eurrouter_git(request, env);
  return eurErrResponse("Incorrect request type specified.");
}

export { eurrouter };
