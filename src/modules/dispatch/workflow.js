import { sendWorkflowStatus } from "../../api/sendworkflow";

const mod = {
  event: "workflow_run",
  func: mod_fn,
};

async function mod_fn(payload) {
  if (payload.repository.full_name !== "eweOS/workflow") return;
  if (payload.action == "completed") {
    await sendWorkflowStatus(payload);
  }
}

export default mod;
