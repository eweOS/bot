import { sendRichText } from "./send";
import { env } from "cloudflare:workers";

async function sendWorkflowStatus(status) {
  var txt = "";
  var emoji = "ℹ️";
  let workflow = status.workflow_run;
  switch (workflow.conclusion) {
    case "success": {
      emoji = "✅";
      break;
    }
    case "failure": {
      emoji = "❌";
      break;
    }
  }
  let workflowid = workflow.path.replace(".yml", "").split("/").at(-1);
  txt += `<b>${emoji} Workflow <code>#${workflow.run_number}</code> @ <code>${workflowid}</code> ${workflow.conclusion}</b>\n\n`;
  txt += `<code>${workflow.display_title}</code>\n\n`;
  txt += `#${workflow.conclusion} #${workflowid}\n`;
  txt += `<a href="${workflow.html_url}">Workflow URL</a>`;
  let sendresult = await sendRichText(
    env.ENV_BOT_WORKFLOW_CHANNEL,
    txt,
    null,
    "html",
    true,
    workflow.conclusion == "success"
  );
}

export { sendWorkflowStatus };
