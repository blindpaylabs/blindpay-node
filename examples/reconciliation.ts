// Workflow 4: reconcile with the auto-pager. It sends limit=100 and follows the cursor until
// has_more is false, so it never loads every row in one response.
import { BlindPay } from "../src";

const blindpay = new BlindPay({
    apiKey: process.env.BLINDPAY_API_KEY ?? "",
    instanceId: process.env.BLINDPAY_INSTANCE_ID ?? "",
});

export async function completedPayoutTotal(customerId: string): Promise<number> {
    let cents = 0;
    for await (const payout of blindpay.payouts.listAutoPaging({
        customer_id: customerId,
        status: "completed",
    })) {
        cents += payout.sender_amount ?? 0; // integer cents
    }
    return cents;
}
