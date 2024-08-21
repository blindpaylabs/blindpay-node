export interface CreateQuoteIn {
    amount: number;
    currency: string;
}
export interface CreateQuoteOut {
    id: string;
    amount: number;
    currency: string;
    rate: number;
}
export interface CheckQuoteIn {
    amount: number;
    currency: string;
}
export interface CheckQuoteOut {
    id: string;
    valid_until: string;
    rate: number;
}
