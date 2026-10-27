import type {
    AccountClass,
    KycStatus,
    Network,
    PayinPaymentMethod,
    PayinTrackingComplete,
    PayinTrackingPayment,
    PayinTrackingTransaction,
    PayoutTrackingComplete,
    PayoutTrackingLiquidity,
    PayoutTrackingPayment,
    PayoutTrackingTransaction,
    TrackingStatus,
    TransactionStatus,
    WalletToken,
} from "../../../types";
import type { ListBankAccountsResponse } from "../bank-accounts";
import type { GetCustomerResponse, GetLimitIncreaseRequestsResponse, KycType } from "../customers";
import type { Payable } from "../payables";
import type { BlindpayBankDetails } from "../payins";
import type { TransferTrackingStep, TransferTrackingTransactionMonitoring } from "../transfers";
import type { VirtualAccount } from "../virtual-accounts";
import type { GetBlockchainWalletResponse } from "../wallets/blockchain";
import type { CustodialWallet } from "../wallets/custodial";

// Payloads that are the resource itself plus `webhook_event` (same property set as the entity
// schema in the OpenAPI spec) reuse the SDK entity type.

export type BankAccountWebhookEvent = {
    webhook_event: "bankAccount.new";
} & ListBankAccountsResponse[number];

export type BlockchainWalletWebhookEvent = {
    webhook_event: "blockchainWallet.new" | "blockchainWallet.update";
} & GetBlockchainWalletResponse;

export type CustomerWebhookEvent = {
    webhook_event: "customer.new" | "customer.update";
} & GetCustomerResponse;

export type LimitIncreaseWebhookEvent = {
    webhook_event: "limitIncrease.new" | "limitIncrease.update";
} & GetLimitIncreaseRequestsResponse[number];

export type PayableWebhookEvent = {
    webhook_event: "payable.new" | "payable.update" | "payable.complete";
} & Payable;

export type VirtualAccountWebhookEvent = {
    webhook_event: "virtualAccount.new" | "virtualAccount.complete";
} & VirtualAccount;

export type WalletWebhookEvent = {
    webhook_event: "wallet.new" | "wallet.update";
} & CustodialWallet;

// Payloads with their own shape (a subset of the entity, or no entity at all).

export type PayinWebhookEvent = {
    webhook_event: "payin.new" | "payin.update" | "payin.complete" | "payin.partnerFee";
    id: string;
    status: TransactionStatus;
    pix_code?: string | null;
    memo_code?: string | null;
    clabe?: string | null;
    partner_fee?: number;
    tracking_complete: PayinTrackingComplete;
    tracking_payment: PayinTrackingPayment;
    tracking_transaction: PayinTrackingTransaction;
    billing_fee_amount?: number | null;
    transaction_fee_amount?: number | null;
    blindpay_bank_details: BlindpayBankDetails;
    customer_id?: string | null;
    receiver_amount?: number | null;
    payment_method?: PayinPaymentMethod | null;
    sender_amount?: number | null;
};

export type PayoutWebhookEvent = {
    webhook_event: "payout.new" | "payout.update" | "payout.complete" | "payout.partnerFee";
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    billing_fee_amount?: number | null;
    transaction_fee_amount?: number | null;
    partner_fee?: number;
    tracking_complete: PayoutTrackingComplete;
    tracking_payment: PayoutTrackingPayment;
    tracking_transaction: PayoutTrackingTransaction;
    tracking_liquidity?: PayoutTrackingLiquidity | null;
    tracking_documents?: {
        step: TrackingStatus;
        status?: "waiting_documents" | "compliance_reviewing" | null;
        reviewed_by?: string | null;
        completed_at?: string | null;
    } | null;
    customer_id?: string | null;
    bank_account_id?: string | null;
    offramp_wallet_id?: string | null;
    payable_id?: string | null;
};

export type TransferWebhookEvent = {
    webhook_event: "transfer.new" | "transfer.update" | "transfer.complete";
    id: string;
    status: Exclude<TransactionStatus, "on_hold">;
    tracking_bridge_swap: TransferTrackingStep;
    tracking_complete: TransferTrackingStep;
    tracking_paymaster: TransferTrackingStep;
    tracking_transaction_monitoring: TransferTrackingTransactionMonitoring;
    tracking_partner_fee?: TransferTrackingStep | null;
};

export type TosAcceptWebhookEvent = {
    webhook_event: "tos.accept";
    tos_id: string;
    idempotency_key: string;
    customer_id?: string | null;
    version?: "1.0.0" | "1.0.1" | null;
};

export type CustomerDeleteWebhookEvent = {
    webhook_event: "customer.delete";
    id: string;
    customer_id: string;
    instance_id: string;
    type: AccountClass;
    kyc_type: KycType;
    kyc_status: KycStatus;
    deleted_at: string;
};

export type WalletInboundToken = {
    address: string;
    id: string;
    symbol: WalletToken;
    amount: number;
};

export type WalletInboundWebhookEvent = {
    webhook_event: "wallet.inbound";
    id: string;
    address: string;
    network: Network;
    token: WalletInboundToken;
    deposit_id: string;
    transaction_hash: string;
};

/**
 * A verified webhook payload, discriminated by `webhook_event`. Narrow it with a `switch` on
 * `event.webhook_event` to get the payload type of that event.
 */
export type WebhookEvent =
    | BankAccountWebhookEvent
    | BlockchainWalletWebhookEvent
    | CustomerWebhookEvent
    | CustomerDeleteWebhookEvent
    | LimitIncreaseWebhookEvent
    | PayableWebhookEvent
    | PayinWebhookEvent
    | PayoutWebhookEvent
    | TosAcceptWebhookEvent
    | TransferWebhookEvent
    | VirtualAccountWebhookEvent
    | WalletWebhookEvent
    | WalletInboundWebhookEvent;
