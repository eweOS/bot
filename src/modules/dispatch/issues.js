import { labelIssue, delabelIssue } from "../../api/github";

const mod = {
  event: "issues",
  func: mod_fn,
};

const condition = ["opened", "reopened", "edited"];

const action_add = "[AddPkg]";
const action_remove = "[RemovePkg]";

const valid_label = "issue-action: valid";
const invalid_label = "issue-action: invalid";

// format: package_name1(, package_name2, ...)
// package_name: [a-zA-Z0-9-_\.]+
function validate(title) {
  return title.match(/^[a-zA-Z0-9-_\.]+(?:, [a-zA-Z0-9-_\.]+)*$/);
}

async function verify_issue(issue, pkgs) {
  if (!validate(pkgs)) {
    await labelIssue(issue, [invalid_label]);
    try {
      await delabelIssue(issue, valid_label);
    } finally {
      return;
    }
  } else {
    await labelIssue(issue, [valid_label]);
    try {
      await delabelIssue(issue, invalid_label);
    } finally {
      return;
    }
  }
}

async function mod_fn(payload) {
  if (payload.repository.full_name !== "eweOS/packages") return;
  if (condition.includes(payload.action)) {
    if (
      payload.issue.title.split(" ")[0] == action_add ||
      payload.issue.title.split(" ")[0] == action_remove
    )
      await verify_issue(
        payload.issue.number,
        payload.issue.title.substring(action_add.length + 1),
      );
    return;
  }
}

export default mod;
