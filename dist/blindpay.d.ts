import { ApiKeysService } from "./services/api-keys.service";
import { BankAccountsService } from "./services/bank-accounts.service";
import { AvailableService } from "./services/available.service";
export declare class Blindpay {
    readonly key?: string | undefined;
    private readonly headers;
    private readonly baseUrl;
    readonly apiKeys: ApiKeysService;
    readonly bankAccounts: BankAccountsService;
    readonly available: AvailableService;
    constructor(key?: string | undefined, baseUrl?: string);
}
