import { ApiKeysService } from "./services/api-keys.service";
import { AvailableService } from "./services/available.service";
import { BankAccountsService } from "./services/bank-accounts.service";
import { InstanceService } from "./services/instance.service";
import { OnboardingService } from "./services/onboarding.service";
import { PayoutService } from "./services/payout.service";
import { QuoteService } from "./services/quote.service";
import { ReceiverService } from "./services/receiver.service";
import { PayinQuoteService } from "./services/payin-quote.service";
export declare class Blindpay {
    readonly key: string;
    readonly instanceId?: string | undefined;
    private readonly headers;
    private readonly baseUrl;
    readonly apiKeys: ApiKeysService;
    readonly available: AvailableService;
    readonly bankAccounts: BankAccountsService;
    readonly instances: InstanceService;
    readonly onboardings: OnboardingService;
    readonly payouts: PayoutService;
    readonly quotes: QuoteService;
    readonly receivers: ReceiverService;
    readonly payinQuotes: PayinQuoteService;
    constructor(key: string, instanceId?: string | undefined, baseUrl?: string);
}
