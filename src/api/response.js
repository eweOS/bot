async function errResponse(str) {
  return jsonResponse({
    error: true,
    msg: str,
  });
}

async function setResponse(str) {
  return jsonResponse({
    error: false,
    msg: str,
  });
}

async function jsonResponse(json) {
  const jsons = JSON.stringify(json);
  return new Response(jsons, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "https://os.ewe.moe",
    },
  });
}

export { jsonResponse, errResponse, setResponse };
