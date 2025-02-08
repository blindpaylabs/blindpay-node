const { Blindpay, CountryCode } = require("../../dist");

const blindpay = new Blindpay();

async function createReceiver() {
  const receiver = await blindpay.apiKeys.getApiKeys();
  console.log(receiver);
}

createReceiver();
