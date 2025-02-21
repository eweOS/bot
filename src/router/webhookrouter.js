import { checkwebhook } from "../filter";
import { errResponse, setResponse } from "../api/response";
import modules from "../modules/dispatch";

async function webhookrouter(request) {
  const payload = await request.json();
  if (!(await checkwebhook(request, payload)))
    return errResponse("Invalid request");

  const hooktype = request.headers.get("X-GitHub-Event");
  console.log(hooktype);
  if (hooktype in modules) {
    if (!("repository" in payload)) {
      await modules[hooktype].func(payload);
      return setResponse("Workflow success!");
    } else if (modules[hooktype].repos.includes(payload.repository.full_name)) {
      await modules[hooktype].func(payload);
      return setResponse("Workflow success!");
    }
  }
  return errResponse("Unexpected behavior");
}

export { webhookrouter };
