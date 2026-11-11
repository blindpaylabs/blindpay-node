import type { WebhookEvents } from "../resources/webhooks";

/**
 * Runtime copy of the `WebhookEvents` union (which api-sync and contract-check read as text),
 * so `constructWebhookEvent` can tell a known event from one this SDK version predates.
 * `src/webhooks.test.ts` asserts the two stay equal.
 */
export const WEBHOOK_EVENT_NAMES = [
    "bankAccount.new",
    "payout.new",
    "payout.update",
    "payout.complete",
    "payout.partnerFee",
    "blockchainWallet.new",
    "blockchainWallet.update",
    "payin.new",
    "payin.update",
    "payin.complete",
    "payin.partnerFee",
    "tos.accept",
    "limitIncrease.new",
    "limitIncrease.update",
    "virtualAccount.new",
    "virtualAccount.complete",
    "transfer.new",
    "transfer.update",
    "transfer.complete",
    "wallet.new",
    "wallet.inbound",
    "customer.new",
    "customer.update",
    "payable.complete",
    "payable.new",
    "payable.update",
    "wallet.update",
    "customer.delete",
] as const satisfies readonly WebhookEvents[];
