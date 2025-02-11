import { Blindpay } from "blindpay";
const blindpay = new Blindpay("your-api-key"); // This cannot be placed in the client-side code

export default defineEventHandler(async (event) => {
  const data = await blindpay.payouts.retrievePayoutTrack("po_...");
  return data;
});
