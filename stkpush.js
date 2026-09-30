const {shortcode, stamp, call} = require("./_mpesa");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({error: "Use POST"});
  const {phone, amount} = req.body || {};
  if (!/^254[17]\d{8}$/.test(phone || "") || !(amount >= 1)) return res.status(400).json({error: "Invalid phone number or amount."});
  const {timestamp, password} = stamp();
  const d = await call("/mpesa/stkpush/v1/processrequest", {
    BusinessShortCode: shortcode, Password: password, Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", Amount: Math.round(amount),
    PartyA: phone, PartyB: shortcode, PhoneNumber: phone,
    CallBackURL: "https://" + req.headers.host + "/api/callback",
    AccountReference: "SokoCorner", TransactionDesc: "Soko Corner order"
  });
  if (d.ResponseCode !== "0") return res.status(502).json({error: d.errorMessage || d.ResponseDescription || "M-Pesa rejected the request."});
  res.json({CheckoutRequestID: d.CheckoutRequestID});
};
