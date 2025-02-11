import { Blindpay } from "blindpay";

const blindpay = new Blindpay("your-api-key"); // This cannot be created on the client side

export async function GET() {
  const response = await blindpay.payouts.retrievePayoutTrack("po_...");

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
