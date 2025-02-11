import { BaseService } from "./base.service";
import { DeleteInstanceResponse, InstanceMember, UpdateInstanceRequest, UpdateInstanceResponse } from "../types/instance.types";
import { BaseResponse } from "../types/util-types";
export declare class InstanceService extends BaseService {
    protected readonly BASE_PATH = "/instances";
    private static readonly INSTANCE_PATH;
    private static readonly INSTANCE_MEMBERS_PATH;
    /**
     * Updates a specific instance
     * @param requestBody - The instance update data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the update response or an error
     */
    updateInstance(requestBody: UpdateInstanceRequest, instanceId?: string): Promise<BaseResponse<UpdateInstanceResponse>>;
    /**
     * Deletes a specific instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    deleteInstance(instanceId?: string): Promise<BaseResponse<DeleteInstanceResponse>>;
    /**
     * Retrieves all members of a specific instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of instance members or an error
     */
    getInstanceMembers(instanceId?: string): Promise<BaseResponse<InstanceMember[]>>;
}
