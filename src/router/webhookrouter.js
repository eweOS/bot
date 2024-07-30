import { checkwebhook } from "../filter";
import { errResponse, setResponse } from "../api/response";
import modules from "../modules/dispatch";

async function webhookrouter(request) {
  const payload = await request.json();
  if (!(await checkwebhook(request, payload)))
    return errResponse("Invalid request");

  const hooktype = request.headers.get("X-GitHub-Event");
  if (hooktype in modules) {
    await modules[hooktype].func(payload);
    return setResponse("Workflow success!");
  } else {
    return errResponse("Unexpected behavior");
  }
}

export { webhookrouter };
