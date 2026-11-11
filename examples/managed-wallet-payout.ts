// Workflow 2: pay a bank account from a BlindPay managed wallet.
// Quote with bank_account_id, then payouts.createEvm with wallet_id and an explicit key.
import { randomUUID } from "node:crypto";
import { BlindPay } from "../src";

const blindpay = new BlindPay({
    apiKey: process.env.BLINDPAY_API_KEY ?? "",
    instanceId: process.env.BLINDPAY_INSTANCE_ID ?? "",
});

export async function payOut(bankAccountId: string, walletId: string): Promise<string> {
    const quote = await blindpay.quotes.create({
        bank_account_id: bankAccountId,
        currency_type: "sender",
        request_amount: 10_000, // integer cents: 100.00 USDC
        network: "base",
        token: "USDC",
    });
    if (quote.error) throw new Error(quote.error.message);

    // Keep the key with the quote: resending with it can never create a second payout.
    const idempotencyKey = randomUUID();
    const payout = await blindpay.payouts.createEvm(
        { quote_id: quote.data.id, wallet_id: walletId },
        { idempotencyKey }
    );
    if (payout.error) {
        // A 5xx is not resent automatically: the payout may exist. Look it up first (e.g.
        // payouts.list({ status: "processing" })), then resend with the same key if it doesn't.
        if (payout.error.retryable)
            console.log("check, then resend with", payout.error.idempotency_key);
        throw new Error(payout.error.message);
    }
    // The outcome arrives by webhook: payout.complete, or payout.update with status "failed".
    return payout.data.id;
}
