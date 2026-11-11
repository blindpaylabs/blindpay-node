// Workflow 3: a fiat payin. Quote first, then create the payin from the quote.
import { BlindPay } from "../src";

const blindpay = new BlindPay({
    apiKey: process.env.BLINDPAY_API_KEY ?? "",
    instanceId: process.env.BLINDPAY_INSTANCE_ID ?? "",
});

export async function startPixPayin(blockchainWalletId: string): Promise<string | null> {
    const quote = await blindpay.payins.quotes.create({
        blockchain_wallet_id: blockchainWalletId,
        currency_type: "sender",
        payment_method: "pix",
        request_amount: 50_000, // integer cents: R$ 500.00
        token: "USDC",
    });
    if (quote.error) throw new Error(quote.error.message);

    // Quotes expire after 5 minutes: create the payin right away.
    const payin = await blindpay.payins.createEvm(quote.data.id);
    if (payin.error) throw new Error(payin.error.message);
    return payin.data.pix_code ?? null; // show this to the payer; payin.complete follows
}
