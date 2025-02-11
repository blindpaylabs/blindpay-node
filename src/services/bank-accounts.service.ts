import { BaseService } from "./base.service";
import {
  BankAccountResponse,
  CreateBankAccountRequest,
  DeleteBankAccountResponse,
} from "../types/bank-account.types";
import { BaseResponse } from "../types/util-types";

export class BankAccountsService extends BaseService {
  protected readonly BASE_PATH =
    "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts";
  private static readonly BANK_ACCOUNT_PATH =
    "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{id}";

  /**
   * Creates a new bank account for a receiver
   * @param receiverId - The receiver ID (15 characters)
   * @param requestBody - The bank account creation data
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the created bank account or an error
   */
  async createBankAccount(
    receiverId: string,
    requestBody: CreateBankAccountRequest,
    instanceId?: string
  ): Promise<BaseResponse<BankAccountResponse>> {
    const intance = instanceId || this.instanceId || "";
    this.validateInstanceId(intance);
    this.validateReceiverId(receiverId);

    const path = this.replaceParams(this.BASE_PATH, {
      instance_id: intance,
      receiver_id: receiverId,
    });

    return this._post<BankAccountResponse>(path, requestBody);
  }

  /**
   * Retrieves all bank accounts for a receiver
   * @param receiverId - The receiver ID (15 characters)
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing an array of bank accounts or an error
   */
  async getBankAccounts(
    receiverId: string,
    instanceId?: string
  ): Promise<BaseResponse<BankAccountResponse[]>> {
    const intance = instanceId || this.instanceId || "";
    this.validateInstanceId(intance);
    this.validateReceiverId(receiverId);

    const path = this.replaceParams(this.BASE_PATH, {
      instance_id: intance,
      receiver_id: receiverId,
    });

    return this._get<BankAccountResponse[]>(path);
  }

  /**
   * Retrieves a specific bank account
   * @param receiverId - The receiver ID (15 characters)
   * @param bankAccountId - The bank account ID (15 characters)
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the bank account or an error
   */
  async getBankAccount(
    receiverId: string,
    bankAccountId: string,
    instanceId: string
  ): Promise<BaseResponse<BankAccountResponse>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);
    this.validateReceiverId(receiverId);
    this.validateBankAccountId(bankAccountId);

    const path = this.replaceParams(BankAccountsService.BANK_ACCOUNT_PATH, {
      instance_id: instance,
      receiver_id: receiverId,
      id: bankAccountId,
    });

    return this._get<BankAccountResponse>(path);
  }

  /**
   * Deletes a specific bank account
   * @param receiverId - The receiver ID (15 characters)
   * @param bankAccountId - The bank account ID (15 characters)
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   */
  async deleteBankAccount(
    receiverId: string,
    bankAccountId: string,
    instanceId?: string
  ): Promise<BaseResponse<DeleteBankAccountResponse>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);
    this.validateReceiverId(receiverId);
    this.validateBankAccountId(bankAccountId);

    const path = this.replaceParams(BankAccountsService.BANK_ACCOUNT_PATH, {
      instance_id: instance,
      receiver_id: receiverId,
      id: bankAccountId,
    });

    return this._delete<DeleteBankAccountResponse>(path);
  }

  /**
   * Validates receiver ID format
   * @param receiverId - The receiver ID to validate
   * @throws Error if the receiver ID is invalid
   */
  private validateReceiverId(receiverId: string): void {
    if (!receiverId || receiverId.length !== 15) {
      throw new Error("Receiver ID must be exactly 15 characters long");
    }
  }

  /**
   * Validates bank account ID format
   * @param bankAccountId - The bank account ID to validate
   * @throws Error if the bank account ID is invalid
   */
  private validateBankAccountId(bankAccountId: string): void {
    if (!bankAccountId || bankAccountId.length !== 15) {
      throw new Error("Bank Account ID must be exactly 15 characters long");
    }
    if (!bankAccountId.startsWith("ba_")) {
      throw new Error("Bank Account ID must start with 'ba_'");
    }
  }
}
