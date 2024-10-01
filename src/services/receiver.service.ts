import { BaseService } from "./base.service";
import {
  CreateReceiverIn,
  Receiver,
  UpdateReceiverAddressIn,
  UpdateReceiverProfileIn,
} from "../types/receiver-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";

export class ReceiverService extends BaseService {
  protected endpoint = "/instances/{instance_id}/receivers";

  private replaceInstanceId(path: string, instanceId: string): string {
    return path.replace("{instance_id}", instanceId);
  }

  async createReceiver(
    instanceId: string,
    receiverData: CreateReceiverIn
  ): Promise<{
    data: Pick<Receiver, "id"> | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this.post<Pick<Receiver, "id">>(path, receiverData);
  }

  async getReceivers(
    instanceId: string
  ): Promise<{ data: Receiver[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this.get<Receiver[]>(path);
  }

  async updateReceiverAddress(
    instanceId: string,
    receiverId: string,
    addressData: UpdateReceiverAddressIn
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}/address`,
      instanceId
    ).replace("{id}", receiverId);
    return this.put<SuccessResponse>(path, addressData);
  }

  async getReceiverAddress(
    instanceId: string,
    receiverId: string
  ): Promise<{
    data: UpdateReceiverAddressIn | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}/address`,
      instanceId
    ).replace("{id}", receiverId);
    return this.get<UpdateReceiverAddressIn>(path);
  }

  async updateReceiverProfile(
    instanceId: string,
    receiverId: string,
    profileData: UpdateReceiverProfileIn
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}/profile`,
      instanceId
    ).replace("{id}", receiverId);
    return this.put<SuccessResponse>(path, profileData);
  }

  async getReceiverProfile(
    instanceId: string,
    receiverId: string
  ): Promise<{
    data: UpdateReceiverProfileIn | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}/profile`,
      instanceId
    ).replace("{id}", receiverId);
    return this.get<UpdateReceiverProfileIn>(path);
  }
}
