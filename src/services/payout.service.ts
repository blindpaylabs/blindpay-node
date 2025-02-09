import { BaseService } from "./base.service";
import { Payout, PayoutEVM } from "../types/payout-types";
import { ErrorResponse } from "../types/error-response";

export class PayoutService extends BaseService {
  protected BASE_PATH = "/instances/{instance_id}/payouts";
  protected EXTERNAL_PATH = "/e/payouts";

  async retrievePayout(
    payoutId: string,
    instanceId?: string
  ): Promise<{ data: Payout | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/{id}`,
      instanceId
    ).replace("{id}", payoutId);
    return this._get<Payout>(path);
  }

  async retrievePayouts(
    instanceId?: string
  ): Promise<{ data: Payout[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._get<Payout[]>(path);
  }

  async retrievePayoutTrack(
    payoutId: string
  ): Promise<{ data: Payout | null; error: ErrorResponse | null }> {
    const path = `${this.EXTERNAL_PATH}/{id}`.replace("{id}", payoutId);
    return this._get<Payout>(path);
  }

  async createPayout(
    payout: PayoutEVM,
    instanceId?: string
  ): Promise<{ data: Payout | null; error: ErrorResponse | null }> {
    const path = `${this.replaceInstanceId(this.BASE_PATH, instanceId)}/evm`;
    return this._post<Payout>(path, payout);
  }
}
