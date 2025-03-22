import { Token } from "./quote-types";
import { Network } from "./util-types";
export declare enum PayinStatus {
    Processing = "processing",
    Failed = "failed",
    Refunded = "refunded",
    Completed = "completed"
}
export interface TrackingTransaction {
    step: string;
    status: string | null;
    external_id: string | null;
    completed_at: string | null;
}
export interface TrackingPayment {
    step: string;
    provider_name: string | null;
    completed_at: string | null;
}
export interface TrackingComplete {
    step: string;
    transaction_hash: string | null;
    completed_at: string | null;
}
export interface TrackingPartnerFee {
    step: string;
    transaction_hash: string | null;
    completed_at: string | null;
}
export interface PayinEVM {
    payin_quote_id: string;
}
export interface Payin {
    id: string;
    status: PayinStatus;
    pix_code: string | null;
    memo_code: string | null;
    clabe: string | null;
    payin_quote_id: string;
    instance_id: string;
    tracking_transaction: TrackingTransaction;
    tracking_payment: TrackingPayment;
    tracking_complete: TrackingComplete;
    tracking_partner_fee: TrackingPartnerFee | null;
    created_at: string;
    updated_at: string;
    image_url: string | null;
    first_name: string | null;
    last_name: string | null;
    legal_name: string | null;
    payment_method: "ach" | "wire" | "pix" | "spei";
    sender_amount: number;
    receiver_amount: number;
    token: Token;
    partner_fee_amount: number | null;
    name: string;
    address: string | null;
    network: Network;
    blindpay_bank_details: {
        routing_number: string;
        account_number: string;
        account_type: string;
        beneficiary: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
        receiving_bank: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
    };
}
