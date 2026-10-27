import type {
    BlindpayApiResponse,
    Network,
    PaginationMetadata,
    PaginationParams,
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
};

export type GetCustodialWalletBalanceInput = {
    customer_id: string;
    id: string;
};

export type GetCustodialWalletBalanceResponse = {
    USDC: WalletTokenBalance;
    USDT: WalletTokenBalance;
    USDB: WalletTokenBalance;
};

export type DeleteCustodialWalletInput = {
    customer_id: string;
    id: string;
};

export type WalletDepositNetwork =
    | "base"
    | "sepolia"
    | "arbitrum_sepolia"
    | "base_sepolia"
    | "arbitrum"
    | "polygon"
    | "polygon_amoy"
    | "ethereum"
    | "stellar"
    | "stellar_testnet"
    | "tron"
    | "solana"
    | "solana_devnet"
    | "tempo"
    | "tempo_testnet"
    | "arc"
    | "arc_testnet";

export type WalletDepositToken = "USDC" | "USDT" | "USDB" | "EURC" | "EURB";

export type WalletDepositStatus = "processing" | "completed" | "on_hold" | "refunded";

export type WalletDeposit = {
    id: string;
    wallet_id: string;
    network: WalletDepositNetwork;
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

export type GetCustodialWalletYieldInput = {
    customer_id: string;
    id: string;
};

export type YieldVault = {
    address: string;
    apy: number | null;
};

export type YieldPosition = {
    token: StablecoinToken;
    vault: YieldVault;
    apy: number | null;
    gross_amount: number;
    fee_accrued: number;
    earning_amount: number;
    max_withdrawable: number;
    total_deposited: number;
    total_withdrawn: number;
    lifetime_earned_amount: number;
};

export type GetCustodialWalletYieldResponse = {
    status: YieldStatus;
    as_of: string;
    fee_bps: number;
    positions: YieldPosition[];
};

export type GetCustodialWalletYieldHistoryInput = {
    customer_id: string;
    id: string;
    token?: StablecoinToken;
    from?: string;
    to?: string;
};

export type YieldHistoryRow = {
    date: string;
    token: StablecoinToken;
    earning_amount: number;
    earned_day: number;
    apy: number | null;
};

export type GetCustodialWalletYieldHistoryResponse = {
    data: YieldHistoryRow[];
};

export type GetCustodialWalletYieldTransactionsInput = PaginationParams & {
    customer_id: string;
    id: string;
    token?: StablecoinToken;
};

export type YieldTransactionType = "deposit" | "redeem" | "fee";

export type YieldTransactionTrigger =
    | "sweep"
    | "payout"
    | "transfer"
    | "disable"
    | "fee_collection";

export type YieldTransactionStatus = "pending" | "confirmed" | "failed";

export type YieldTransactionReferenceType = "payout" | "transfer";

export type YieldTransactionReference = {
    type: YieldTransactionReferenceType;
    id: string;
};

export type YieldTransaction = {
    id: string;
    token: StablecoinToken;
    type: YieldTransactionType;
    trigger: YieldTransactionTrigger;
    reference: YieldTransactionReference | null;
    status: YieldTransactionStatus;
    amount: number;
    transaction_hash: string | null;
    created_at: string;
};

export type GetCustodialWalletYieldTransactionsResponse = {
    data: YieldTransaction[];
    pagination: PaginationMetadata;
};

export type EnableCustodialWalletYieldInput = {
    customer_id: string;
    id: string;
};

export type EnableCustodialWalletYieldResponse = CustodialWallet;

export type DisableCustodialWalletYieldInput = {
    customer_id: string;
    id: string;
};

export type DisableCustodialWalletYieldResponse = CustodialWallet;

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
        getYield({
            customer_id,
            id,
        }: GetCustodialWalletYieldInput): Promise<
            BlindpayApiResponse<GetCustodialWalletYieldResponse>
        > {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/yield`
            );
        },
        getYieldHistory({
            customer_id,
            id,
            ...params
        }: GetCustodialWalletYieldHistoryInput): Promise<
            BlindpayApiResponse<GetCustodialWalletYieldHistoryResponse>
        > {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/yield/history${toQueryString(params)}`
            );
        },
        getYieldTransactions({
            customer_id,
            id,
            ...params
        }: GetCustodialWalletYieldTransactionsInput): Promise<
            BlindpayApiResponse<GetCustodialWalletYieldTransactionsResponse>
        > {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/yield/transactions${toQueryString(params)}`
            );
        },
        enableYield({
            customer_id,
            id,
        }: EnableCustodialWalletYieldInput): Promise<
            BlindpayApiResponse<EnableCustodialWalletYieldResponse>
        > {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/yield/enable`,
                {}
            );
        },
        disableYield({
            customer_id,
            id,
        }: DisableCustodialWalletYieldInput): Promise<
            BlindpayApiResponse<DisableCustodialWalletYieldResponse>
        > {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/wallets/${id}/yield/disable`,
                {}
            );
        },
    };
}
