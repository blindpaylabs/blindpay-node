import { BaseService } from "./base.service";
import { Payin, PayinEVM } from "../types/payin-types";
import { ErrorResponse } from "../types/error-response";
/**
 * Service for managing payins, including creation, retrieval, and tracking of payments
 * across different payment networks and systems.
 */
export declare class PayinService extends BaseService {
    protected BASE_PATH: string;
    protected EXTERNAL_PATH: string;
    /**
     * Retrieves a specific payin by its ID
     * @param payinId - The unique identifier of the payin
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the payin details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    retrievePayin(payinId: string, instanceId?: string): Promise<{
        data: Payin | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves all payins for an instance
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing an array of payins or an error
     * @throws Error if the instance ID is provided and invalid
     */
    retrievePayins(limit?: number, offset?: number, instanceId?: string): Promise<{
        data: Payin[] | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves tracking information for a specific payin using the external tracking endpoint
     * This method can be used to track payins without requiring an instance ID
     * @param payinId - The unique identifier of the payin to track
     * @returns A promise containing the payin tracking details or an error
     */
    retrievePayinTrack(payinId: string): Promise<{
        data: Payin | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Creates a new EVM (Ethereum Virtual Machine) payin for an instance
     * @param payin - The payin details conforming to the EVM payment network requirements
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the created payin details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    createPayin(payin: PayinEVM, instanceId?: string): Promise<{
        data: Payin | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Exports payins for an instance in CSV format
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the CSV data or an error
     * @throws Error if the instance ID is provided and invalid
     */
    exportPayins(instanceId?: string): Promise<{
        data: string | null;
        error: ErrorResponse | null;
    }>;
}
