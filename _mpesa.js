// Shared helpers for the Daraja API. Secrets come from environment variables, never from the browser.
const BASE = process.env.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
const shortcode = process.env.MPESA_SHORTCODE || "174379";

async function getToken() {
  const auth = Buffer.from(process.env.MPESA_KEY + ":" + process.env.MPESA_SECRET).toString("base64");
  const r = await fetch(BASE + "/oauth/v1/generate?grant_type=client_credentials", {headers: {Authorization: "Basic " + auth}});
  return (await r.json()).access_token;
}
function stamp() {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const password = Buffer.from(shortcode + process.env.MPESA_PASSKEY + timestamp).toString("base64");
  return {timestamp, password};
}
async function call(path, body) {
  const token = await getToken();
  const r = await fetch(BASE + path, {method: "POST", headers: {"Content-Type": "application/json", Authorization: "Bearer " + token}, body: JSON.stringify(body)});
  return r.json();
}
module.exports = {shortcode, stamp, call};
