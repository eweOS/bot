import { errResponse } from "../api/response";

async function defaultrouter(request) {
  const contentType = request.headers.get("content-type");
  if (contentType) {
    if (contentType.includes("application/json")) {
      console.log(await request.json());
    } else if (contentType.includes("application/text")) {
      console.log(request.text());
    } else if (contentType.includes("text/html")) {
      console.log(request.text());
    } else if (contentType.includes("form")) {
      const formData = await request.formData();
      const body = {};
      for (const entry of formData.entries()) {
        body[entry[0]] = entry[1];
      }
      console.log(body);
    }
  }
  return errResponse("No handler for this request");
}

export { defaultrouter };
