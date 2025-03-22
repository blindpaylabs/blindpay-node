import { BaseService } from "./base.service";
import { Payin, PayinEVM } from "../types/payin-types";
import { ErrorResponse } from "../types/error-response";

/**
 * Service for managing payins, including creation, retrieval, and tracking of payments
 * across different payment networks and systems.
 */
export class PayinService extends BaseService {
  protected BASE_PATH = "/instances/{instance_id}/payins";
  protected EXTERNAL_PATH = "/e/payins";

  /**
   * Retrieves a specific payin by its ID
   * @param payinId - The unique identifier of the payin
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing the payin details or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async retrievePayin(
    payinId: string,
    instanceId?: string
  ): Promise<{ data: Payin | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/{id}`,
      instanceId
    ).replace("{id}", payinId);
    return this._get<Payin>(path);
  }

  /**
   * Retrieves all payins for an instance
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing an array of payins or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async retrievePayins(
    limit?: number,
    offset?: number,
    instanceId?: string
  ): Promise<{ data: Payin[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._get<Payin[]>(path, {
      limit: limit?.toString() ?? "25",
      offset: offset?.toString() ?? "0",
    });
  }

  /**
   * Retrieves tracking information for a specific payin using the external tracking endpoint
   * This method can be used to track payins without requiring an instance ID
   * @param payinId - The unique identifier of the payin to track
   * @returns A promise containing the payin tracking details or an error
   */
  async retrievePayinTrack(
    payinId: string
  ): Promise<{ data: Payin | null; error: ErrorResponse | null }> {
    const path = `${this.EXTERNAL_PATH}/{id}`.replace("{id}", payinId);
    return this._get<Payin>(path);
  }

  /**
   * Creates a new EVM (Ethereum Virtual Machine) payin for an instance
   * @param payin - The payin details conforming to the EVM payment network requirements
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing the created payin details or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async createPayin(
    payin: PayinEVM,
    instanceId?: string
  ): Promise<{ data: Payin | null; error: ErrorResponse | null }> {
    const path = `${this.replaceInstanceId(this.BASE_PATH, instanceId)}/evm`;
    return this._post<Payin>(path, payin);
  }

  /**
   * Exports payins for an instance in CSV format
   * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
   * @returns A promise containing the CSV data or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async exportPayins(
    instanceId?: string
  ): Promise<{ data: string | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      "/instances/{instance_id}/export/payins",
      instanceId
    );
    return this._get<string>(path);
  }
}
