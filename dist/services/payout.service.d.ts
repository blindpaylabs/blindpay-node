import { BaseService } from "./base.service";
import { Payout, PayoutEVM } from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";
export declare class PayoutService extends BaseService {
    protected BASE_PATH: string;
    protected EXTERNAL_PATH: string;
    retrievePayout(payoutId: string, instanceId?: string): Promise<{
        data: Payout | null;
        error: ErrorResponse | null;
    }>;
    retrievePayouts(instanceId?: string): Promise<{
        data: Payout[] | null;
        error: ErrorResponse | null;
    }>;
    retrievePayoutTrack(payoutId: string): Promise<{
        data: Payout | null;
        error: ErrorResponse | null;
    }>;
    createPayout(payout: PayoutEVM, instanceId?: string): Promise<{
        data: Payout | null;
        error: ErrorResponse | null;
    }>;
}
