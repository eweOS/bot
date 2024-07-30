import * as process from "node:process";
import { hmacverify } from "./utils/webhooksign";

function checkmessage(message) {
  const allowed_users = [
    283338155, // @YukariChiba
    5990757608, // @ziyao233
  ];

  const allowed_groups = [
    -1001650785315, // @eweos4dev
    -511871661, // YukariChiba Personal Test Group
  ];
  if (!message.text) return false;
  if (!message.from) return false;
  if (!allowed_users.includes(message.from.id)) return false;
  if (message.chat.type === "channel") return false;
  if (message.chat.type !== "private")
    if (!allowed_groups.includes(message.chat.id)) return false;
  return true;
}

async function checkwebhook(request, payload) {
  if (request.method !== "POST") return false;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return false;

  const hooktype = request.headers.get("X-GitHub-Event");
  if (!hooktype) return false;

  const signature = request.headers.get("X-Hub-Signature");
  if (!signature) return false;

  const ver = await hmacverify(
    process.env.ENV_GITHUB_WEBHOOK_TOKEN,
    JSON.stringify(payload),
    signature.replace("sha1=", "")
  );
  if (!ver) return false;

  return true;
}

export { checkmessage, checkwebhook };
