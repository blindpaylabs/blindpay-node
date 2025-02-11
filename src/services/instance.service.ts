import { BaseService } from "./base.service";
import {
  DeleteInstanceResponse,
  InstanceMember,
  UpdateInstanceRequest,
  UpdateInstanceResponse,
} from "../types/instance.types";

import { BaseResponse } from "../types/util-types";

export class InstanceService extends BaseService {
  protected readonly BASE_PATH = "/instances";
  private static readonly INSTANCE_PATH = "/instances/{id}";
  private static readonly INSTANCE_MEMBERS_PATH = "/instances/{id}/members";

  /**
   * Updates a specific instance
   * @param requestBody - The instance update data
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the update response or an error
   */
  async updateInstance(
    requestBody: UpdateInstanceRequest,
    instanceId?: string
  ): Promise<BaseResponse<UpdateInstanceResponse>> {
    const intance = instanceId || this.instanceId || "";
    this.validateInstanceId(intance);

    const path = this.replaceParams(InstanceService.INSTANCE_PATH, {
      id: intance,
    });

    return this._put<UpdateInstanceResponse>(path, requestBody);
  }

  /**
   * Deletes a specific instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   */
  async deleteInstance(
    instanceId?: string
  ): Promise<BaseResponse<DeleteInstanceResponse>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);

    const path = this.replaceParams(InstanceService.INSTANCE_PATH, {
      id: instance,
    });

    return this._delete<DeleteInstanceResponse>(path);
  }

  /**
   * Retrieves all members of a specific instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing an array of instance members or an error
   */
  async getInstanceMembers(
    instanceId?: string
  ): Promise<BaseResponse<InstanceMember[]>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);

    const path = this.replaceParams(InstanceService.INSTANCE_MEMBERS_PATH, {
      id: instance,
    });

    return this._get<InstanceMember[]>(path);
  }
}
