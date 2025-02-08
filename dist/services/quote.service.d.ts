import { BaseService } from "./base.service";
import { CreateQuoteIn, CreateQuoteOut, CheckQuoteIn, CheckQuoteOut } from "../types/quote-types";
import { ErrorResponse } from "../types/error-response";
export declare class QuoteService extends BaseService {
    protected endpoint: string;
    createQuote(instanceId: string, quoteData: CreateQuoteIn): Promise<{
        data: CreateQuoteOut | null;
        error: ErrorResponse | null;
    }>;
    checkQuote(instanceId: string, checkData: CheckQuoteIn): Promise<{
        data: CheckQuoteOut | null;
        error: ErrorResponse | null;
    }>;
}
