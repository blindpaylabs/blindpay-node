import { BaseService } from "./base.service";
import { CreateReceiverIn, Receiver, UpdateReceiverAddressIn, UpdateReceiverProfileIn } from "../types/receiver-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";
export declare class ReceiverService extends BaseService {
    protected endpoint: string;
    private replaceInstanceId;
    createReceiver(instanceId: string, receiverData: CreateReceiverIn): Promise<{
        data: Pick<Receiver, "id"> | null;
        error: ErrorResponse | null;
    }>;
    getReceivers(instanceId: string): Promise<{
        data: Receiver[] | null;
        error: ErrorResponse | null;
    }>;
    updateReceiverAddress(instanceId: string, receiverId: string, addressData: UpdateReceiverAddressIn): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getReceiverAddress(instanceId: string, receiverId: string): Promise<{
        data: UpdateReceiverAddressIn | null;
        error: ErrorResponse | null;
    }>;
    updateReceiverProfile(instanceId: string, receiverId: string, profileData: UpdateReceiverProfileIn): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getReceiverProfile(instanceId: string, receiverId: string): Promise<{
        data: UpdateReceiverProfileIn | null;
        error: ErrorResponse | null;
    }>;
}
