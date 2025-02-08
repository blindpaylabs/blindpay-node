import { BaseService } from "./base.service";
import { Receiver, UpdateReceiver } from "../types/receiver-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";
export declare class ReceiverService extends BaseService {
    protected endpoint: string;
    createReceiver(instanceId: string, receiverData: Receiver): Promise<{
        data: Pick<Receiver, "id"> | null;
        error: ErrorResponse | null;
    }>;
    getReceivers(instanceId: string): Promise<{
        data: Receiver[] | null;
        error: ErrorResponse | null;
    }>;
    getReceiver(instanceId: string, receiverId: string): Promise<{
        data: Receiver | null;
        error: ErrorResponse | null;
    }>;
    updateReceiver(instanceId: string, receiverId: string, addressData: UpdateReceiver): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
}
