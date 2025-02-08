import { BaseService } from "./base.service";
import {
  PayoutOnEvmOut,
  CreatePayoutOnEvmIn,
  GetPayoutOut,
} from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";

export class PayoutService extends BaseService {
  protected endpoint = "/instances/{instance_id}/payouts";

  async getPayoutById(
    payoutId: string,
    instanceId?: string
  ): Promise<{ data: GetPayoutOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}`,
      instanceId
    ).replace("{id}", payoutId);
    return this._get<GetPayoutOut>(path);
  }

  async getPayoutTrackById(
    payoutId: string
  ): Promise<{ data: GetPayoutOut | null; error: ErrorResponse | null }> {
    const path = `/e/payouts/${payoutId}`;
    return this._get<GetPayoutOut>(path);
  }

  async createPayoutOnEvm(
    payoutData: CreatePayoutOnEvmIn,
    instanceId?: string
  ): Promise<{ data: PayoutOnEvmOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(`${this.endpoint}/evm`, instanceId);
    return this._post<PayoutOnEvmOut>(path, payoutData);
  }

  async getPayouts(
    instanceId?: string
  ): Promise<{ data: GetPayoutOut[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this._get<GetPayoutOut[]>(path);
  }
}
