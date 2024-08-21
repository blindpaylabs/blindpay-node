export interface Payout {
  id: string;
  instance_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePayoutOnEvmIn {
  amount: number;
  receiver_address: string;
  token: string;
}

export interface PayoutOnEvmOut {
  transaction_hash: string;
  status: string;
}

export interface GetPayoutOut {
  id: string;
  instance_id: string;
  amount: number;
  status: string;
}
