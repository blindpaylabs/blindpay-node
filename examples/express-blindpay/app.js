const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const { Blindpay } = require("blindpay");
  const blindpay = new Blindpay("your-api-key");

  blindpay.payouts
    .retrievePayoutTrack("po_...")
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
