import { BaseService } from "./base.service";
import { FX, Quote } from "../types/quote-types";
import { ErrorResponse } from "../types/error-response";
export declare class QuoteService extends BaseService {
    protected BASE_PATH: string;
    createQuote(quoteData: Quote, instanceId?: string): Promise<{
        data: Quote | null;
        error: ErrorResponse | null;
    }>;
    getFXRate(checkData: FX, instanceId?: string): Promise<{
        data: Quote | null;
        error: ErrorResponse | null;
    }>;
}
