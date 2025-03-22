import { CurrencyType } from "./quote-types";

export enum PayinToken {
  USDC = "USDC",
  USDT = "USDT",
  USDB = "USDB",
  USDX = "USDX",
}

export interface PayinQuote {
  blockchain_wallet_id: string;
  currency_type: CurrencyType;
  cover_fees: boolean;
  request_amount: number;
  payment_method: string;
  token: PayinToken;
  partner_fee_id: string;
}
