import { Network } from "./util-types";

export enum CurrencyType {
  Sender = "sender",
  Receiver = "receiver",
}

export enum Token {
  USDC = "USDC",
  USDT = "USDT",
  USDB = "USDB",
  USDX = "USDX",
  BRL = "BRL",
  USD = "USD",
  MXN = "MXN",
  COP = "COP",
  ARS = "ARS",
}

export interface Quote {
  bank_account_id: string;
  currency_type: CurrencyType;
  cover_fees: boolean | null;
  request_amount: number;
  network: Network;
  token: Token;
  partner_fee_id: string | null;
}

export interface FX {
  from: Token;
  to: Token;
  request_amount: number;
  currency_type: CurrencyType;
}
