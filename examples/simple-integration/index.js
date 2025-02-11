const { Blindpay } = require("blindpay");

const blindpay = new Blindpay("your-api-key");

async function createReceiver() {
  const data = await blindpay.payouts.retrievePayoutTrack("po_...");

  return data;
}

createReceiver();
