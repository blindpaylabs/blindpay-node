import { BaseService } from "./base.service";
import {
  Payout,
  PayoutOnEvmOut,
  CreatePayoutOnEvmIn,
  GetPayoutOut,
} from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";

export class PayoutService extends BaseService {
  protected endpoint = "/instances/{instance_id}/payouts";

  private replaceInstanceId(path: string, instanceId: string): string {
    return path.replace("{instance_id}", instanceId);
  }

  async getPayoutById(
    instanceId: string,
    payoutId: string
  ): Promise<{ data: GetPayoutOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/{id}`,
      instanceId
    ).replace("{id}", payoutId);
    return this.get<GetPayoutOut>(path);
  }

  async getPayoutTrackById(
    payoutId: string
  ): Promise<{ data: GetPayoutOut | null; error: ErrorResponse | null }> {
    const path = `/e/payouts/${payoutId}`;
    return this.get<GetPayoutOut>(path);
  }

  async createPayoutOnEvm(
    instanceId: string,
    payoutData: CreatePayoutOnEvmIn
  ): Promise<{ data: PayoutOnEvmOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(`${this.endpoint}/evm`, instanceId);
    return this.post<PayoutOnEvmOut>(path, payoutData);
  }

  async getPayouts(
    instanceId: string
  ): Promise<{ data: GetPayoutOut[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this.get<GetPayoutOut[]>(path);
  }
}
