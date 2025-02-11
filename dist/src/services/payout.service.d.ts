import { BaseService } from "./base.service";
import { Payout, PayoutEVM } from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";
/**
 * Service for managing payouts, including creation, retrieval, and tracking of payments
 * across different payment networks and systems.
 */
export declare class PayoutService extends BaseService {
    protected BASE_PATH: string;
    protected EXTERNAL_PATH: string;
    /**
     * Retrieves a specific payout by its ID
     * @param payoutId - The unique identifier of the payout
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the payout details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    retrievePayout(payoutId: string, instanceId?: string): Promise<{
        data: Payout | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves all payouts for an instance
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing an array of payouts or an error
     * @throws Error if the instance ID is provided and invalid
     */
    retrievePayouts(instanceId?: string): Promise<{
        data: Payout[] | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves tracking information for a specific payout using the external tracking endpoint
     * This method can be used to track payouts without requiring an instance ID
     * @param payoutId - The unique identifier of the payout to track
     * @returns A promise containing the payout tracking details or an error
     */
    retrievePayoutTrack(payoutId: string): Promise<{
        data: Payout | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Creates a new EVM (Ethereum Virtual Machine) payout for an instance
     * @param payout - The payout details conforming to the EVM payment network requirements
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the created payout details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    createPayout(payout: PayoutEVM, instanceId?: string): Promise<{
        data: Payout | null;
        error: ErrorResponse | null;
    }>;
}
