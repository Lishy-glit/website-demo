// Safaricom posts the final payment result here. Shown in your host's function logs.
// To keep a permanent record of orders, save `req.body.Body.stkCallback` to a database here.
module.exports = (req, res) => {
  console.log("M-Pesa callback:", JSON.stringify(req.body));
  res.json({ResultCode: 0, ResultDesc: "Accepted"});
};
