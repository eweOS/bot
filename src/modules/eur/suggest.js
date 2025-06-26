import { eurErrResponse } from "../../api/eur";

const mod = {
  type: "suggest",
  func: mod_fn,
};

async function mod_fn(data, env) {
  return eurErrResponse(data);
}

export default mod;
