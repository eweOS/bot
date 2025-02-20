import { dispatchRepository, reactIssueComment } from "../../api/github";

const mod = {
  event: "issue_comment",
  func: mod_fn,
};

const action_add = "[AddPkg]";
const action_remove = "[RemovePkg]";

const condition = ["created"];
const association = ["OWNER", "MEMBER", "COLLABORATOR"];

const valid_label = "issue-action: valid";
const invalid_label = "issue-action: invalid";

async function mod_fn(payload) {
  if (payload.repository.full_name !== "eweOS/packages") return;
  if ("pull_request" in payload.issue) return;
  if (!condition.includes(payload.action)) return;
  if (
    payload.issue.title.split(" ")[0] == action_add ||
    payload.issue.title.split(" ")[0] == action_remove
  )
    return;
  if (payload.issue.labels.find((o) => o.name === invalid_label)) return;
  if (!payload.issue.labels.find((o) => o.name === valid_label)) return;
  if (!association.includes(payload.comment.author_association)) return;
  if (!comment.body.startsWith("/approve ")) return;

  if (payload.issue.title.split(" ")[0] == action_add) {
    for (let pkg_name of payload.issue.title
      .substring(action_add.length + 1)
      .split(", "))
      await dispatchRepository("creation", { pkg: pkg_name });
    await reactIssueComment(payload.comment.id, "hooray");
  }
  return;
}

export default mod;
