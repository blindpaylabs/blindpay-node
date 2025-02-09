import { BaseService } from "./base.service";
import { Payout, PayoutEVM } from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";

/**
 * Service for managing payouts, including creation, retrieval, and tracking of payments
 * across different payment networks and systems.
 */
export class PayoutService extends BaseService {
  protected BASE_PATH = "/instances/{instance_id}/payouts";
  protected EXTERNAL_PATH = "/e/payouts";

  /**
   * Retrieves a specific payout by its ID
   * @param payoutId - The unique identifier of the payout
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing the payout details or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async retrievePayout(
    payoutId: string,
    instanceId?: string
  ): Promise<{ data: Payout | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/{id}`,
      instanceId
    ).replace("{id}", payoutId);
    return this._get<Payout>(path);
  }

  /**
   * Retrieves all payouts for an instance
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing an array of payouts or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async retrievePayouts(
    instanceId?: string
  ): Promise<{ data: Payout[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._get<Payout[]>(path);
  }

  /**
   * Retrieves tracking information for a specific payout using the external tracking endpoint
   * This method can be used to track payouts without requiring an instance ID
   * @param payoutId - The unique identifier of the payout to track
   * @returns A promise containing the payout tracking details or an error
   */
  async retrievePayoutTrack(
    payoutId: string
  ): Promise<{ data: Payout | null; error: ErrorResponse | null }> {
    const path = `${this.EXTERNAL_PATH}/{id}`.replace("{id}", payoutId);
    return this._get<Payout>(path);
  }

  /**
   * Creates a new EVM (Ethereum Virtual Machine) payout for an instance
   * @param payout - The payout details conforming to the EVM payment network requirements
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing the created payout details or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async createPayout(
    payout: PayoutEVM,
    instanceId?: string
  ): Promise<{ data: Payout | null; error: ErrorResponse | null }> {
    const path = `${this.replaceInstanceId(this.BASE_PATH, instanceId)}/evm`;
    return this._post<Payout>(path, payout);
  }
}
