import { version } from "../package.json";
import { ApiKeysService } from "./services/api-keys.service";
import { AvailableService } from "./services/available.service";
import { BankAccountsService } from "./services/bank-accounts.service";
import { InstanceService } from "./services/instance.service";
import { OnboardingService } from "./services/onboarding.service";
import { PayoutService } from "./services/payout.service";
import { QuoteService } from "./services/quote.service";
import { ReceiverService } from "./services/receiver.service";
import { PayinQuoteService } from "./services/payin-quote.service";

const defaultBaseUrl = "https://api.blindpay.com/v1";
const defaultUserAgent = `blindpay-sdk:${version}`;

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
  readonly payinQuotes: PayinQuoteService;

  constructor(
    readonly key: string,
    readonly instanceId?: string,
    baseUrl?: string
  ) {
    if (!key) {
      throw new Error(
        'Missing API key. Pass it to the constructor `new Blindpay("your-api-key")`'
      );
    }
    if (typeof window !== "undefined") {
      throw new Error("This SDK is not intended for use in the browser.");
    }

    this.baseUrl = baseUrl || defaultBaseUrl;

    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "User-Agent": defaultUserAgent,
      "Content-Type": "application/json",
    });

    this.apiKeys = new ApiKeysService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.bankAccounts = new BankAccountsService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.available = new AvailableService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.instances = new InstanceService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.onboardings = new OnboardingService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.payouts = new PayoutService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.quotes = new QuoteService(this.baseUrl, this.headers, this.instanceId);
    this.receivers = new ReceiverService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
    this.payinQuotes = new PayinQuoteService(
      this.baseUrl,
      this.headers,
      this.instanceId
    );
  }
}
