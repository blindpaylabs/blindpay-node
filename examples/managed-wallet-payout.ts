// Workflow 2: fund a BlindPay managed wallet with a fiat payin, then pay a bank account from it.
// 1. wallets.custodial.create, 2. payins.quotes.create with wallet_id, 3. payins.createEvm,
// 4. wait for payin.complete / wallet.inbound (webhook), 5. quotes.create with bank_account_id,
// 6. payouts.createEvm with wallet_id (the wallet must be on the quote's network) and a key.
import { randomUUID } from "node:crypto";
import { BlindPay, type Network } from "../src";

const blindpay = new BlindPay({
    apiKey: process.env.BLINDPAY_API_KEY ?? "",
    instanceId: process.env.BLINDPAY_INSTANCE_ID ?? "",
});

/** One network for both legs: payouts.createEvm needs the wallet on the quote's network. */
const NETWORK: Network = "base";

/** Steps 1-3: a managed wallet and a PIX payin that credits it. Returns what the payer needs. */
export async function fundManagedWallet(
    customerId: string
): Promise<{ walletId: string; payinId: string; pixCode: string | null }> {
    const wallet = await blindpay.wallets.custodial.create(
        { customer_id: customerId, name: "Treasury", network: NETWORK },
        { idempotencyKey: randomUUID() }
    );
    if (wallet.error) throw new Error(wallet.error.code ?? wallet.error.message);

    // wallet_id (a bl_ managed wallet) instead of blockchain_wallet_id; no network on payin quotes.
    const quote = await blindpay.payins.quotes.create({
        wallet_id: wallet.data.id,
        currency_type: "sender",
        payment_method: "pix",
        request_amount: 60_000, // integer cents: R$ 600.00
        token: "USDC", // USDB on a development instance
    });
    if (quote.error) throw new Error(quote.error.code ?? quote.error.message);

    // Quotes expire after 5 minutes: create the payin right away.
    const payin = await blindpay.payins.createEvm(quote.data.id, {
        idempotencyKey: randomUUID(),
    });
    if (payin.error) throw new Error(payin.error.code ?? payin.error.message);
    // Step 4: the wallet is credited when payin.complete (and wallet.inbound) arrive by webhook;
    // see examples/webhooks.ts. A development instance completes payins in about 30 seconds.
    return {
        walletId: wallet.data.id,
        payinId: payin.data.id,
        pixCode: payin.data.pix_code ?? null,
    };
}

/** Steps 5-6: once the wallet is funded, pay a bank account from it. */
export async function payOut(bankAccountId: string, walletId: string): Promise<string> {
    const quote = await blindpay.quotes.create({
        bank_account_id: bankAccountId,
        currency_type: "sender",
        request_amount: 10_000, // integer cents: 100.00 USDC
        network: NETWORK,
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
