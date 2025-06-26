import { eurResponse, demopkg } from "../../api/eur";

const mod = {
  type: "info",
  func: mod_fn,
};

async function mod_fn(data, env) {
  return eurResponse([demopkg]);
}

export default mod;
