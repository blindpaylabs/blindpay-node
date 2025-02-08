import { BaseService } from "./base.service";
import { BankAccount } from "../types/bank-account";
import {
  CreateBankAccountRequest,
  CreateBankAccountResponse,
} from "../types/create-bank-account";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";

export class BankAccountsService extends BaseService {
  protected endpoint =
    "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts";

  async createBankAccount(
    instanceId: string,
    receiverId: string,
    requestBody: CreateBankAccountRequest
  ): Promise<{
    data: CreateBankAccountResponse | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId).replace(
      "{receiver_id}",
      receiverId
    );
    return this._post<CreateBankAccountResponse>(path, requestBody);
  }

  async getBankAccounts(
    instanceId: string,
    receiverId: string
  ): Promise<{ data: BankAccount[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId).replace(
      "{receiver_id}",
      receiverId
    );
    return this._get<BankAccount[]>(path);
  }

  async deleteBankAccount(
    instanceId: string,
    receiverId: string,
    bankAccountId: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId)
      .replace("{receiver_id}", receiverId)
      .concat(`/${bankAccountId}`);
    return this._delete<SuccessResponse>(path);
  }
}
