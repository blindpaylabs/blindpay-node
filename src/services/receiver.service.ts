import { BaseService } from "./base.service";
import {
  CreateReceiverRequest,
  UpdateReceiverRequest,
  ReceiverResponse,
  DeleteReceiverResponse,
} from "../types/receiver-types";
import { BaseResponse } from "../types/util-types";

export class ReceiverService extends BaseService {
  protected readonly BASE_PATH = "/instances/{instance_id}/receivers";
  private static readonly RECEIVER_PATH =
    "/instances/{instance_id}/receivers/{id}";

  /**
   * Creates a new receiver
   * @param data - The receiver data
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the created receiver ID or an error
   */
  async createReceiver(
    data: CreateReceiverRequest,
    instanceId: string
  ): Promise<BaseResponse<{ id: string }>> {
    this.validateInstanceId(instanceId);
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._post<{ id: string }>(path, data);
  }

  /**
   * Retrieves all receivers for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing an array of receivers or an error
   */
  async getReceivers(
    instanceId: string
  ): Promise<BaseResponse<ReceiverResponse[]>> {
    this.validateInstanceId(instanceId);
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._get<ReceiverResponse[]>(path);
  }

  /**
   * Retrieves a specific receiver
   * @param instanceId - The instance ID (15 characters)
   * @param receiverId - The receiver ID (15 characters)
   * @returns A promise containing the receiver data or an error
   */
  async getReceiver(
    instanceId: string,
    receiverId: string
  ): Promise<BaseResponse<ReceiverResponse>> {
    this.validateInstanceId(instanceId);
    this.validateReceiverId(receiverId);
    const path = this.replaceParams(ReceiverService.RECEIVER_PATH, {
      instance_id: instanceId,
      id: receiverId,
    });
    return this._get<ReceiverResponse>(path);
  }

  /**
   * Updates a receiver's information
   * @param instanceId - The instance ID (15 characters)
   * @param receiverId - The receiver ID (15 characters)
   * @param data - The updated receiver data
   * @returns A promise containing a success response or an error
   */
  async updateReceiver(
    instanceId: string,
    receiverId: string,
    data: UpdateReceiverRequest
  ): Promise<BaseResponse<DeleteReceiverResponse>> {
    this.validateInstanceId(instanceId);
    this.validateReceiverId(receiverId);
    const path = this.replaceParams(ReceiverService.RECEIVER_PATH, {
      instance_id: instanceId,
      id: receiverId,
    });
    return this._put<DeleteReceiverResponse>(path, data);
  }

  /**
   * Deletes a receiver
   * @param instanceId - The instance ID (15 characters)
   * @param receiverId - The receiver ID (15 characters)
   * @returns A promise containing a success response or an error
   */
  async deleteReceiver(
    instanceId: string,
    receiverId: string
  ): Promise<BaseResponse<DeleteReceiverResponse>> {
    this.validateInstanceId(instanceId);
    this.validateReceiverId(receiverId);
    const path = this.replaceParams(ReceiverService.RECEIVER_PATH, {
      instance_id: instanceId,
      id: receiverId,
    });
    return this._delete<DeleteReceiverResponse>(path);
  }

  /**
   * Validates receiver ID format
   * @param receiverId - The receiver ID to validate
   * @throws Error if the receiver ID is invalid
   */
  private validateReceiverId(receiverId: string): void {
    if (!receiverId || receiverId.length !== 15) {
      throw new Error("Receiver ID must be exactly 15 characters long");
    }
  }
}
