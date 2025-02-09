import { BaseService } from "./base.service";
import { BankAccountResponse, CreateBankAccountRequest, DeleteBankAccountResponse } from "../types/bank-account.types";
import { BaseResponse } from "../types/util-types";
export declare class BankAccountsService extends BaseService {
    protected readonly BASE_PATH = "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts";
    private static readonly BANK_ACCOUNT_PATH;
    /**
     * Creates a new bank account for a receiver
     * @param receiverId - The receiver ID (15 characters)
     * @param requestBody - The bank account creation data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the created bank account or an error
     */
    createBankAccount(receiverId: string, requestBody: CreateBankAccountRequest, instanceId?: string): Promise<BaseResponse<BankAccountResponse>>;
    /**
     * Retrieves all bank accounts for a receiver
     * @param receiverId - The receiver ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of bank accounts or an error
     */
    getBankAccounts(receiverId: string, instanceId?: string): Promise<BaseResponse<BankAccountResponse[]>>;
    /**
     * Retrieves a specific bank account
     * @param receiverId - The receiver ID (15 characters)
     * @param bankAccountId - The bank account ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the bank account or an error
     */
    getBankAccount(receiverId: string, bankAccountId: string, instanceId: string): Promise<BaseResponse<BankAccountResponse>>;
    /**
     * Deletes a specific bank account
     * @param receiverId - The receiver ID (15 characters)
     * @param bankAccountId - The bank account ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    deleteBankAccount(receiverId: string, bankAccountId: string, instanceId?: string): Promise<BaseResponse<DeleteBankAccountResponse>>;
    /**
     * Validates instance ID format
     * @param instanceId - The instance ID to validate
     * @throws Error if the instance ID is invalid
     */
    private validateInstanceId;
    /**
     * Validates receiver ID format
     * @param receiverId - The receiver ID to validate
     * @throws Error if the receiver ID is invalid
     */
    private validateReceiverId;
    /**
     * Validates bank account ID format
     * @param bankAccountId - The bank account ID to validate
     * @throws Error if the bank account ID is invalid
     */
    private validateBankAccountId;
    /**
     * Replaces all parameters in a path string
     * @param path - The path template
     * @param params - Object containing parameter values
     * @returns The path with replaced parameters
     */
    private replaceParams;
}
