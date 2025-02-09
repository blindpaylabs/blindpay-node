import { Token } from "./quote-types";
import { Network, TransferType } from "./util-types";

export enum PayoutStatus {
  Processing = "processing",
  Failed = "failed",
  Refunded = "refunded",
  Completed = "completed",
}
export interface TrackingTransaction {
  step: string;
  status: string;
  transaction_hash: string;
  completed_at: string;
}

export interface TrackingPayment {
  step: string;
  provider_name: string;
  provider_transaction_id: string;
  provider_status: string;
  estimated_time_of_arrival: string;
  completed_at: string;
}

export interface TrackingComplete {
  step: string;
  status: string;
  transaction_hash: string;
  completed_at: string;
}

export interface TrackingPartnerFee {
  step: string;
  transaction_hash: string;
  completed_at: string;
}

export interface PayoutEVM {
  quote_id: string;
  sender_wallet_address: string;
}

export interface Payout {
  id: string;
  instance_id: string;
  amount: number;
  status: PayoutStatus;
  sender_wallet_address: string;
  quote_id: string;
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
  network: Network;
  token: Token;
  sender_amount: number;
  receiver_amount: number;
  partner_fee_amount: number | null;
  name: string;
  type: TransferType;
  pix_key: string | null;
  account_number: string | null;
  routing_number: string | null;
}
