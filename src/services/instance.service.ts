import { BaseService } from "./base.service";
import { Instance } from "../types/instance";
import {
  CreateInstanceRequest,
  CreateInstanceResponse,
} from "../types/create-instance";
import { ErrorResponse } from "../types/error-response";

export class InstanceService extends BaseService {
  protected endpoint = "/instances";

  async createInstance(requestBody: CreateInstanceRequest): Promise<{
    data: CreateInstanceResponse | null;
    error: ErrorResponse | null;
  }> {
    return this._post<CreateInstanceResponse>(this.endpoint, requestBody);
  }

  async getInstances(): Promise<{
    data: Instance[] | null;
    error: ErrorResponse | null;
  }> {
    return this._get<Instance[]>(this.endpoint);
  }
}
