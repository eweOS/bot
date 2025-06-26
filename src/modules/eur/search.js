import { eurResponse } from "../../api/eur";
import { eurSearchDemo } from "../../utils/eurdb";

const mod = {
  type: "search",
  func: mod_fn,
};

async function mod_fn(data, env) {
  console.log(data);
  if (!("arg" in data)) return eurResponse([]);
  //TODO: check args
  const results = await eurSearchDemo(data.arg, env.DB);
  console.log(results);
  return eurResponse(results);
}

export default mod;
