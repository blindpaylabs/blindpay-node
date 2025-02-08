import { BaseService } from "./base.service";
import { BankAccount } from "../types/bank-account";
import { CreateBankAccountRequest, CreateBankAccountResponse } from "../types/create-bank-account";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";
export declare class BankAccountsService extends BaseService {
    protected endpoint: string;
    createBankAccount(instanceId: string, receiverId: string, requestBody: CreateBankAccountRequest): Promise<{
        data: CreateBankAccountResponse | null;
        error: ErrorResponse | null;
    }>;
    getBankAccounts(instanceId: string, receiverId: string): Promise<{
        data: BankAccount[] | null;
        error: ErrorResponse | null;
    }>;
    deleteBankAccount(instanceId: string, receiverId: string, bankAccountId: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
}
