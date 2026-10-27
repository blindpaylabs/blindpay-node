import type {
    BlindpayApiResponse,
    PaginationMetadata,
    PaginationParams,
    RequestOptions,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import type { StrictOmit } from "../../internal/helpers/strict-omit";
import type { CreateAchInput, CreateWireInput } from "../bank-accounts";

export type PayableCurrency = "BRL" | "USD" | "MXN" | "COP" | "ARS" | "EUR" | "GBP";

export type PayableStatus = "draft" | "processing" | "completed" | "canceled";

export type PayableLastAttemptStatus = "failed" | "refunded";

export type PayableBankAccountType = "ach" | "wire";

export type PayableType = "boleto" | "pix_code" | "invoice";

export type PayableParty = {
    legal_name?: string | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state_province_region?: string | null;
    postal_code?: string | null;
    country?: string | null;
    tax_id?: string | null;
};

export type PayableLineItem = {
    name: string;
    quantity: number;
    price: number | null;
};

export type PayableBankAccount = {
    type: PayableBankAccountType;
    beneficiary_name?: string | null;
    routing_number?: string | null;
    account_number?: string | null;
    account_type?: string | null;
};

export type Payable = {
    id: string;
    instance_id: string;
    customer_id: string;
    from?: PayableParty | null;
    to?: PayableParty | null;
    currency: PayableCurrency;
    line_items?: PayableLineItem[];
    note?: string | null;
    discount?: number | null;
    taxes?: number | null;
    boleto_barcode?: string | null;
    pix_qrcode?: string | null;
    document_file?: string | null;
    due_date?: string | null;
    scheduled_at?: string | null;
    status: PayableStatus;
    created_at?: string | null;
    updated_at?: string | null;
    amount: number | null;
    payout_id?: string | null;
    bank_account?: PayableBankAccount | null;
    last_attempt_status?: PayableLastAttemptStatus | null;
    first_name?: string | null;
    last_name?: string | null;
    legal_name?: string | null;
};

export type ListPayablesInput = PaginationParams & {
    status?: PayableStatus;
    customer_id?: string;
    customer_name?: string;
    type?: PayableType;
    beneficiary_name?: string;
};

export type ListPayablesResponse =
    | {
          data: Payable[];
          pagination: PaginationMetadata;
      }
    | Payable[];

/**
 * Vendor bank account for an invoice payable: the same body
 * `POST /customers/{customer_id}/bank-accounts` takes, limited to `ach` or `wire`.
 * The account belongs to the payable, so no `customer_id` is sent here.
 */
export type CreatePayableBankAccountInput =
    | (StrictOmit<CreateAchInput, "customer_id"> & { type: "ach" })
    | (StrictOmit<CreateWireInput, "customer_id"> & { type: "wire" });

export type CreatePayableInput = {
    customer_id: string;
    currency: PayableCurrency;
    from?: PayableParty | null;
    to?: PayableParty | null;
    line_items?: PayableLineItem[];
    note?: string | null;
    discount?: number | null;
    taxes?: number | null;
    boleto_barcode?: string | null;
    pix_qrcode?: string | null;
    document_file?: string | null;
    due_date?: string | null;
    scheduled_at?: string | null;
    bank_account?: CreatePayableBankAccountInput | null;
};

export type CreatePayableResponse = Payable;

export type GetPayableInput = string;

export type GetPayableResponse = Payable;

export type DeletePayableInput = string;

export type DeletePayableResponse = Payable;

export function createPayablesResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListPayablesInput): Promise<BlindpayApiResponse<ListPayablesResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/payables${queryParams}`);
        },
        create(
            { ...data }: CreatePayableInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreatePayableResponse>> {
            return client.post(`/instances/${instanceId}/payables`, data, options);
        },
        get(id: GetPayableInput): Promise<BlindpayApiResponse<GetPayableResponse>> {
            return client.get(`/instances/${instanceId}/payables/${id}`);
        },
        delete(
            id: DeletePayableInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<DeletePayableResponse>> {
            return client.delete(`/instances/${instanceId}/payables/${id}`, options);
        },
    };
}
