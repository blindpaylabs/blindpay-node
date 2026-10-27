import type {
    BlindpayApiResponse,
    Network,
    PaginationMetadata,
    StablecoinToken,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

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
    symbol: StablecoinToken;
    amount: number;
    earning_amount?: number;
    total_amount?: number;
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

export type WalletDepositToken = "USDC" | "USDT" | "USDB" | "EURC" | "EURB";

export type WalletDepositStatus = "processing" | "completed" | "on_hold" | "refunded";

export type WalletDeposit = {
    id: string;
    wallet_id: string;
    network: Network;
    token: WalletDepositToken;
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
    token?: WalletDepositToken;
    status?: WalletDepositStatus;
};

export type GetCustodialWalletDepositsResponse = {
    data: WalletDeposit[];
    pagination: PaginationMetadata;
};

function toQueryString(params: Record<string, string | undefined>): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) query.append(key, value);
    }
    const serialized = query.toString();
    return serialized ? `?${serialized}` : "";
}

export function createCustodialWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            customer_id: ListCustodialWalletsInput
        ): Promise<BlindpayApiResponse<ListCustodialWalletsResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customer_id}/wallets`);
        },
        get({
            customer_id,
            id,
        }: GetCustodialWalletInput): Promise<BlindpayApiResponse<GetCustodialWalletResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customer_id}/wallets/${id}`);
        },
        create({
            customer_id,
            ...data
        }: CreateCustodialWalletInput): Promise<
            BlindpayApiResponse<CreateCustodialWalletResponse>
        > {
            return client.post(`/instances/${instanceId}/customers/${customer_id}/wallets`, data);
        },
        getBalance({
            customer_id,
            id,
        }: GetCustodialWalletBalanceInput): Promise<
            BlindpayApiResponse<GetCustodialWalletBalanceResponse>
        > {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/balance`
            );
        },
        delete({
            customer_id,
            id,
        }: DeleteCustodialWalletInput): Promise<BlindpayApiResponse<{ success: boolean }>> {
            return client.delete(`/instances/${instanceId}/customers/${customer_id}/wallets/${id}`);
        },
        getDeposits({
            customer_id,
            id,
            ...params
        }: GetCustodialWalletDepositsInput): Promise<
            BlindpayApiResponse<GetCustodialWalletDepositsResponse>
        > {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/deposits${toQueryString(params)}`
            );
        },
    };
}
