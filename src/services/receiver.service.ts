import { BaseService } from "./base.service";
import { Receiver, UpdateReceiver } from "../types/receiver-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";

export class ReceiverService extends BaseService {
  protected endpoint = "/instances/{instance_id}/receivers";

  async createReceiver(
    instanceId: string,
    receiverData: Receiver
  ): Promise<{
    data: Pick<Receiver, "id"> | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this._post<Pick<Receiver, "id">>(path, receiverData);
  }

  async getReceivers(
    instanceId: string
  ): Promise<{ data: Receiver[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this._get<Receiver[]>(path);
  }

  async getReceiver(
    instanceId: string,
    receiverId: string
  ): Promise<{ data: Receiver | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}`,
      instanceId
    ).replace("{id}", receiverId);
    return this._get<Receiver>(path);
  }

  async updateReceiver(
    instanceId: string,
    receiverId: string,
    addressData: UpdateReceiver
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}/address`,
      instanceId
    ).replace("{id}", receiverId);
    return this._put<SuccessResponse>(path, addressData);
  }
}
