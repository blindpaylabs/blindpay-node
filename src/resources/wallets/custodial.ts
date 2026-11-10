import type {
    BlindpayApiResponse,
    Network,
    PaginationMetadata,
    RequestOptions,
    SuccessResponse,
    WalletToken,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import { toQueryString } from "../../internal/query";

export type YieldStatus = "disabled" | "enabled" | "disabling";

export type CustodialWallet = {
    id: string;
    name: string;
    external_id: string | null;
    address: string | null;
    network: Network;
    yield_status?: YieldStatus;
    created_at: string | null;
};

export type CreateCustodialWalletInput = {
    customer_id: string;
    name: string;
    network: Network;
    external_id?: string | null;
};

export type CreateCustodialWalletResponse = CustodialWallet;

export type ListCustodialWalletsInput = string;

export type ListCustodialWalletsResponse = CustodialWallet[];

export type GetCustodialWalletInput = {
    customer_id: string;
    id: string;
};

export type GetCustodialWalletResponse = CustodialWallet;

export type WalletTokenBalance = {
    address: string;
    id: string;
    symbol: WalletToken;
    amount: number;
    earning_amount: number;
    total_amount: number;
};

export type GetCustodialWalletBalanceInput = {
    customer_id: string;
    id: string;
};

export type GetCustodialWalletBalanceResponse = {
    USDC: WalletTokenBalance;
    USDT: WalletTokenBalance;
    USDB: WalletTokenBalance;
    EURB?: WalletTokenBalance;
    EURC?: WalletTokenBalance;
};

export type DeleteCustodialWalletInput = {
    customer_id: string;
    id: string;
};

export type WalletDepositStatus = "processing" | "completed" | "on_hold" | "refunded";

export type WalletDeposit = {
    id: string;
    wallet_id: string;
    network: Network;
    token: WalletToken;
    amount: number;
    token_amount: string | null;
    status: WalletDepositStatus;
    transaction_hash: string;
    sender_address: string | null;
    created_at: string;
};

export type GetCustodialWalletDepositsInput = {
    customer_id: string;
    id: string;
    limit?: "5" | "10" | "50" | "100" | "200";
    starting_after?: string;
    ending_before?: string;
    token?: WalletToken;
    status?: WalletDepositStatus;
};

export type GetCustodialWalletDepositsResponse = {
    data: WalletDeposit[];
    pagination: PaginationMetadata;
};

export function createCustodialWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            customer_id: ListCustodialWalletsInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<ListCustodialWalletsResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customer_id}/wallets`, options);
        },
        get(
            { customer_id, id }: GetCustodialWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<GetCustodialWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}`,
                options
            );
        },
        create(
            { customer_id, ...data }: CreateCustodialWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateCustodialWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/wallets`,
                data,
                options
            );
        },
        getBalance(
            { customer_id, id }: GetCustodialWalletBalanceInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<GetCustodialWalletBalanceResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/balance`,
                options
            );
        },
        delete(
            { customer_id, id }: DeleteCustodialWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}`,
                options
            );
        },
        getDeposits(
            { customer_id, id, ...params }: GetCustodialWalletDepositsInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<GetCustodialWalletDepositsResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/deposits${toQueryString(params)}`,
                options
            );
        },
    };
}
