import { sendWorkflowStatus } from "../../../api/sendworkflow";

const mod = {
  event: "workflow_run",
  repos: ["eweOS/workflow"],
  func: mod_fn,
};

const ignored_workflows = ["pr_closed.yml"];

async function mod_fn(payload) {
  if (payload.action != "completed") return;

  let workflow = payload.workflow_run;
  let workflowid = workflow.path.split("/").at(-1);

  if (ignored_workflows.includes(workflowid)) return;

  await sendWorkflowStatus(payload);
}

export default mod;
