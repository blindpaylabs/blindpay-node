import { BaseService } from "./base.service";
import { Instance } from "../types/instance";
import { CreateInstanceRequest, CreateInstanceResponse } from "../types/create-instance";
import { ErrorResponse } from "../types/error-response";
export declare class InstanceService extends BaseService {
    protected endpoint: string;
    createInstance(requestBody: CreateInstanceRequest): Promise<{
        data: CreateInstanceResponse | null;
        error: ErrorResponse | null;
    }>;
    getInstances(): Promise<{
        data: Instance[] | null;
        error: ErrorResponse | null;
    }>;
}
