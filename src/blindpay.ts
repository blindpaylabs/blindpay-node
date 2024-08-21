import { ApiKeysService } from "./services/api-keys.service";
import { AvailableService } from "./services/available.service";
import { BankAccountsService } from "./services/bank-accounts.service";
import { InstanceService } from "./services/instance.service";
import { OnboardingService } from "./services/onboarding.service";
import { PayoutService } from "./services/payout.service";
import { QuoteService } from "./services/quote.service";
import { ReceiverService } from "./services/receiver.service";

const defaultBaseUrl = "https://api.blindpay.com";
const defaultUserAgent = `blindpay-sdk:1.0.0`;

export class Blindpay {
  private readonly headers: Headers;
  private readonly baseUrl: string;

  readonly apiKeys: ApiKeysService;
  readonly available: AvailableService;
  readonly bankAccounts: BankAccountsService;
  readonly instances: InstanceService;
  readonly onboardings: OnboardingService;
  readonly payouts: PayoutService;
  readonly quotes: QuoteService;
  readonly receivers: ReceiverService;

  constructor(readonly key?: string, baseUrl: string = defaultBaseUrl) {
    if (!key) {
      throw new Error(
        'Missing API key. Pass it to the constructor `new Blindpay("bp_123")`'
      );
    }

    this.baseUrl = baseUrl;

    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "User-Agent": defaultUserAgent,
      "Content-Type": "application/json",
    });

    this.apiKeys = new ApiKeysService(this.baseUrl, this.headers);
    this.bankAccounts = new BankAccountsService(this.baseUrl, this.headers);
    this.available = new AvailableService(this.baseUrl, this.headers);
    this.instances = new InstanceService(this.baseUrl, this.headers);
    this.onboardings = new OnboardingService(this.baseUrl, this.headers);
    this.payouts = new PayoutService(this.baseUrl, this.headers);
    this.quotes = new QuoteService(this.baseUrl, this.headers);
    this.receivers = new ReceiverService(this.baseUrl, this.headers);
  }
}
