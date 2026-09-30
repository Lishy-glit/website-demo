const {shortcode, stamp, call} = require("./_mpesa");
module.exports = async (req, res) => {
  const {timestamp, password} = stamp();
  const d = await call("/mpesa/stkpushquery/v1/query", {
    BusinessShortCode: shortcode, Password: password, Timestamp: timestamp, CheckoutRequestID: req.query.id
  });
  // While the customer has not answered yet, Daraja returns an error with no ResultCode: the page keeps waiting.
  res.json({ResultCode: d.ResultCode === undefined ? undefined : Number(d.ResultCode), ResultDesc: d.ResultDesc});
};
