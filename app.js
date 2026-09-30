const $ = s => document.querySelector(s), cart = {};
let filter = "all";
const kes = n => "KES " + n.toLocaleString();
const total = () => PRODUCTS.reduce((t, p) => t + p.price * (cart[p.id] || 0), 0);

function drawGrid() {
  $("#grid").innerHTML = PRODUCTS.filter(p => filter === "all" || p.type === filter).map(p =>
    `<article class="card"><div class="art" aria-hidden="true">${p.icon}</div>
    <span class="tag ${p.type}">${p.type === "good" ? "Goods" : "Service"}</span>
    <h3>${p.name}</h3><p>${p.desc}</p>
    <div class="row"><strong>${kes(p.price)}</strong><button data-add="${p.id}">Add to cart</button></div></article>`).join("");
}
function drawCart() {
  const rows = PRODUCTS.filter(p => cart[p.id]);
  $("#count").textContent = rows.reduce((n, p) => n + cart[p.id], 0);
  $("#items").innerHTML = rows.length ? rows.map(p =>
    `<div class="line"><span>${p.name} × ${cart[p.id]}</span><span>${kes(p.price * cart[p.id])}
    <button class="x" data-rm="${p.id}" aria-label="Remove ${p.name}">✕</button></span></div>`).join("") : "<p>Your cart is empty. Add something from the shop.</p>";
  $("#total").textContent = kes(total());
  $("#checkout").disabled = !rows.length;
}
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; drawCart(); $("#cart").hidden = false; }
  if (t.dataset.rm) { delete cart[t.dataset.rm]; drawCart(); }
  if (t.dataset.f) { filter = t.dataset.f; document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("on", b === t)); drawGrid(); }
});
$("#cartBtn").onclick = () => $("#cart").hidden = !$("#cart").hidden;
$("#close").onclick = () => $("#cart").hidden = true;
$("#checkout").onclick = () => { msg(""); $("#go").disabled = false; $("#pay").showModal(); };
$("#cancel").onclick = () => $("#pay").close();
$("#form").onsubmit = pay;

const msg = (t, c = "") => { $("#msg").textContent = t; $("#msg").className = c; };
function norm(v) {
  v = v.replace(/[\s+-]/g, "");
  if (/^0[17]\d{8}$/.test(v)) v = "254" + v.slice(1);
  return /^254[17]\d{8}$/.test(v) ? v : null;
}
async function pay(e) {
  e.preventDefault();
  const phone = norm($("#phone").value);
  if (!phone) return msg("Enter a valid Safaricom number, like 0712345678.", "err");
  msg("Sending your M-Pesa request…"); $("#go").disabled = true;
  try {
    const r = await fetch("/api/stkpush", {method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({phone, amount: total()})});
    if ([404, 405].includes(r.status)) return demo();
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "The payment request failed.");
    msg("Check your phone and enter your M-Pesa PIN…"); poll(d.CheckoutRequestID);
  } catch (err) { err instanceof TypeError ? demo() : fail(err.message); }
}
function poll(id, n = 0) {
  setTimeout(async () => {
    try {
      const d = await (await fetch("/api/status?id=" + id)).json();
      if (d.ResultCode === undefined) return n < 15 ? poll(id, n + 1) : fail("Timed out waiting for payment.");
      d.ResultCode == 0 ? done() : fail(d.ResultDesc || "Payment was not completed.");
    } catch { fail("Could not check the payment status."); }
  }, 4000);
}
const demo = () => { msg("Demo mode: no payment server is connected, so this payment is simulated…"); setTimeout(() => done(" (demo)"), 3000); };
function done(note = "") {
  msg("Payment received" + note + ". Thank you, " + $("#name").value + "!", "ok");
  Object.keys(cart).forEach(k => delete cart[k]); drawCart();
  setTimeout(() => { $("#pay").close(); $("#cart").hidden = true; }, 3000);
}
const fail = t => { msg(t, "err"); $("#go").disabled = false; };
drawGrid(); drawCart();
