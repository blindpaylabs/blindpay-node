export interface CreateBankAccountRequest {
  name: string;
  bank_country: string;
  bank_details: string;
  blockchain_address: string;
  currency: string;
}

export interface CreateBankAccountResponse {
  id: string;
  created_at: string;
  updated_at: string;
}
