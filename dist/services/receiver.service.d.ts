import { BaseService } from "./base.service";
import { CreateReceiverRequest, UpdateReceiverRequest, ReceiverResponse, DeleteReceiverResponse } from "../types/receiver-types";
import { BaseResponse } from "../types/util-types";
export declare class ReceiverService extends BaseService {
    protected readonly BASE_PATH = "/instances/{instance_id}/receivers";
    private static readonly RECEIVER_PATH;
    /**
     * Creates a new receiver
     * @param data - The receiver data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the created receiver ID or an error
     */
    createReceiver(data: CreateReceiverRequest, instanceId: string): Promise<BaseResponse<{
        id: string;
    }>>;
    /**
     * Retrieves all receivers for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of receivers or an error
     */
    getReceivers(instanceId: string): Promise<BaseResponse<ReceiverResponse[]>>;
    /**
     * Retrieves a specific receiver
     * @param instanceId - The instance ID (15 characters)
     * @param receiverId - The receiver ID (15 characters)
     * @returns A promise containing the receiver data or an error
     */
    getReceiver(instanceId: string, receiverId: string): Promise<BaseResponse<ReceiverResponse>>;
    /**
     * Updates a receiver's information
     * @param instanceId - The instance ID (15 characters)
     * @param receiverId - The receiver ID (15 characters)
     * @param data - The updated receiver data
     * @returns A promise containing a success response or an error
     */
    updateReceiver(instanceId: string, receiverId: string, data: UpdateReceiverRequest): Promise<BaseResponse<DeleteReceiverResponse>>;
    /**
     * Deletes a receiver
     * @param instanceId - The instance ID (15 characters)
     * @param receiverId - The receiver ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    deleteReceiver(instanceId: string, receiverId: string): Promise<BaseResponse<DeleteReceiverResponse>>;
    /**
     * Validates instance ID format
     * @param instanceId - The instance ID to validate
     * @throws Error if the instance ID is invalid
     */
    private validateInstanceId;
    /**
     * Validates receiver ID format
     * @param receiverId - The receiver ID to validate
     * @throws Error if the receiver ID is invalid
     */
    private validateReceiverId;
    /**
     * Replaces all parameters in a path string
     * @param path - The path template
     * @param params - Object containing parameter values
     * @returns The path with replaced parameters
     */
    private replaceParams;
}
