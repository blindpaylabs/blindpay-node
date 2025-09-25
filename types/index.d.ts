export type BlindpayApiResponse<T> = BlindpayErrorResponse | BlindpaySuccessResponse<T>

export type ErrorResponse = {
    message: string;
}

export type BlindpayErrorResponse = {
    data: null
    error: ErrorResponse;
}

export type BlindpaySuccessResponse<T> = {
    data: T;
    error: null;
}

export type CurrencyType = "sender" | "receiver";

export type Network = "base" | "sepolia" | "arbitrum_sepolia" | "base_sepolia" | "arbitrum" | "polygon" | "polygon_amoy" | "ethereum" | "stellar" | "stellar_testnet" | "tron"

export type StablecoinToken = "USDC" | "USDT" | "USDB"  

export type TransactionDocumentType = "invoice" | "purchase_order" | "delivery_slip" | "contract" | "customs_declaration" | "bill_of_lading" | "others";

export type BankAccountType = "checking" | "savings";

export type Currency = "USDC" | "USDT" | "USDB" | "BRL" | "USD" | "MXN" | "COP" | "ARS";

export type Rail = "wire" | "ach" | "pix" | "spei_bitso" | "transfers_bitso" | "ach_cop_bitso" | "international_swift" | "rtp";
    
export type AccountClass = "individual" | "business";
    
export type TransactionStatus = "refunded" | "processing" | "completed" | "failed" | "on_hold";

export type Country = 
        | "AF"
        | "AL"
        | "DZ"
        | "AS"
        | "AD"
        | "AO"
        | "AI"
        | "AQ"
        | "AG"
        | "AR"
        | "AM"
        | "AW"
        | "AU"
        | "AT"
        | "AZ"
        | "BS"
        | "BH"
        | "BD"
        | "BB"
        | "BY"
        | "BE"
        | "BZ"
        | "BJ"
        | "BM"
        | "BT"
        | "BO"
        | "BQ"
        | "BA"
        | "BW"
        | "BV"
        | "BR"
        | "IO"
        | "BN"
        | "BG"
        | "BF"
        | "BI"
        | "CV"
        | "KH"
        | "CM"
        | "CA"
        | "KY"
        | "CF"
        | "TD"
        | "CL"
        | "CN"
        | "CX"
        | "CC"
        | "CO"
        | "KM"
        | "CD"
        | "CG"
        | "CK"
        | "CR"
        | "HR"
        | "CU"
        | "CW"
        | "CY"
        | "CZ"
        | "CI"
        | "DK"
        | "DJ"
        | "DM"
        | "DO"
        | "EC"
        | "EG"
        | "SV"
        | "GQ"
        | "ER"
        | "EE"
        | "SZ"
        | "ET"
        | "FK"
        | "FO"
        | "FJ"
        | "FI"
        | "FR"
        | "GF"
        | "PF"
        | "TF"
        | "GA"
        | "GM"
        | "GE"
        | "DE"
        | "GH"
        | "GI"
        | "GR"
        | "GL"
        | "GD"
        | "GP"
        | "GU"
        | "GT"
        | "GG"
        | "GN"
        | "GW"
        | "GY"
        | "HT"
        | "HM"
        | "VA"
        | "HN"
        | "HK"
        | "HU"
        | "IS"
        | "IN"
        | "ID"
        | "IR"
        | "IQ"
        | "IE"
        | "IM"
        | "IL"
        | "IT"
        | "JM"
        | "JP"
        | "JE"
        | "JO"
        | "KZ"
        | "KE"
        | "KI"
        | "KP"
        | "KR"
        | "KW"
        | "KG"
        | "LA"
        | "LV"
        | "LB"
        | "LS"
        | "LR"
        | "LY"
        | "LI"
        | "LT"
        | "LU"
        | "MO"
        | "MG"
        | "MW"
        | "MY"
        | "MV"
        | "ML"
        | "MT"
        | "MH"
        | "MQ"
        | "MR"
        | "MU"
        | "YT"
        | "MX"
        | "FM"
        | "MD"
        | "MC"
        | "MN"
        | "ME"
        | "MS"
        | "MA"
        | "MZ"
        | "MM"
        | "NA"
        | "NR"
        | "NP"
        | "NL"
        | "NC"
        | "NZ"
        | "NI"
        | "NE"
        | "NG"
        | "NU"
        | "NF"
        | "MP"
        | "NO"
        | "OM"
        | "PK"
        | "PW"
        | "PS"
        | "PA"
        | "PG"
        | "PY"
        | "PE"
        | "PH"
        | "PN"
        | "PL"
        | "PT"
        | "PR"
        | "QA"
        | "MK"
        | "RO"
        | "RU"
        | "RW"
        | "RE"
        | "BL"
        | "SH"
        | "KN"
        | "LC"
        | "MF"
        | "PM"
        | "VC"
        | "WS"
        | "SM"
        | "ST"
        | "SA"
        | "SN"
        | "RS"
        | "SC"
        | "SL"
        | "SG"
        | "SX"
        | "SK"
        | "SI"
        | "SB"
        | "SO"
        | "ZA"
        | "GS"
        | "SS"
        | "ES"
        | "LK"
        | "SD"
        | "SR"
        | "SJ"
        | "SE"
        | "CH"
        | "SY"
        | "TW"
        | "TJ"
        | "TZ"
        | "TH"
        | "TL"
        | "TG"
        | "TK"
        | "TO"
        | "TT"
        | "TN"
        | "TR"
        | "TM"
        | "TC"
        | "TV"
        | "UG"
        | "UA"
        | "AE"
        | "GB"
        | "UM"
        | "US"
        | "UY"
        | "UZ"
        | "VU"
        | "VE"
        | "VN"
        | "VG"
        | "VI"
        | "WF"
        | "EH"
        | "YE"
        | "ZM"
        | "ZW"
        | "AX";

export type PaginationParams = {
    limit?: '10' | '50' | '100' | '200' | '1000';
    offset?: '0' | '10' | '50' | '100' | '200' | '1000';
    starting_after?: string;
    ending_before?: string;
}

export type PaginationMetadata = {
    has_more: boolean;
    next_page: number;
    prev_page: number;
}

export type TrackingTransaction = {
    step: string;
    status: string;
    transaction_hash: string;
    completed_at: string;
};

export type TrackingPayment = {
    step: string;
    provider_name: string;
    provider_transaction_id: string;
    provider_status: string;
    estimated_time_of_arrival: string;
    completed_at: string;
};

export type TrackingLiquidity = {
    step: string;
    provider_transaction_id: string;
    provider_status: string;
    estimated_time_of_arrival: string;
    completed_at: string;
};

export type TrackingComplete = {
    step: string;
    status: string;
    transaction_hash: string;
    completed_at: string;
};

export type TrackingPartnerFee = {
    step: string;
    transaction_hash: string;
    completed_at: string;
};
