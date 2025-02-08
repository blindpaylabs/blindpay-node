import { BaseService } from "./base.service";
import { PayoutOnEvmOut, CreatePayoutOnEvmIn, GetPayoutOut } from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";
export declare class PayoutService extends BaseService {
    protected endpoint: string;
    getPayoutById(payoutId: string, instanceId?: string): Promise<{
        data: GetPayoutOut | null;
        error: ErrorResponse | null;
    }>;
    getPayoutTrackById(payoutId: string): Promise<{
        data: GetPayoutOut | null;
        error: ErrorResponse | null;
    }>;
    createPayoutOnEvm(payoutData: CreatePayoutOnEvmIn, instanceId?: string): Promise<{
        data: PayoutOnEvmOut | null;
        error: ErrorResponse | null;
    }>;
    getPayouts(instanceId?: string): Promise<{
        data: GetPayoutOut[] | null;
        error: ErrorResponse | null;
    }>;
}
