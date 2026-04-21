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

export type Network = "base" | "sepolia" | "arbitrum_sepolia" | "base_sepolia" | "arbitrum" | "polygon" | "polygon_amoy" | "ethereum" | "stellar" | "stellar_testnet" | "tron" | "solana" | "solana_devnet";

export type StablecoinToken = "USDC" | "USDT" | "USDB";

export type TransactionDocumentType = "invoice" | "purchase_order" | "delivery_slip" | "contract" | "customs_declaration" | "bill_of_lading" | "others";

export type BankAccountType = "checking" | "saving";

export type Currency = "USDC" | "USDT" | "USDB" | "BRL" | "USD" | "MXN" | "COP" | "ARS";

export type Rail = "wire" | "ach" | "pix" | "pix_safe" | "spei_bitso" | "transfers_bitso" | "ach_cop_bitso" | "international_swift" | "rtp";
    
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
    limit?: '10' | '50' | '100' | '200' | '500' | '1000';
    offset?: '0' | '10' | '50' | '100' | '200' | '500' | '1000';
    starting_after?: string;
    ending_before?: string;
}

export type PaginationMetadata = {
    has_more: boolean;
    next_page: string;
    prev_page: string;
}

export type ArgentinaTransfers = "CVU" | "CBU" | "ALIAS";

export type AchCopDocument = "CC" | "CE" | "NIT" | "PASS" | "PEP";

export type PayinTrackingTransaction = {
    step: TrackingStatus
    status?: 'failed' | 'completed' | null;
    external_id: string | null;
    completed_at?: string | null;
    sender_name?: string | null;
    sender_tax_id?: string | null;
    sender_bank_code?: string | null;
    sender_account_number?: string | null;
    trace_number?: string | null;
    transaction_reference?: string | null;
    description?: string | null;
    pse_instruction?: {
      payment_link: string;
      fid: string;
      full_name: string;
      tax_id: string;
      document_type: Extract<AchCopDocument, 'CC' | 'NIT'>;
      phone: string;
      email: string;
      bank_code?: string | null;
    } | null
    transfers_instruction?: {
      account: string;
      type: ArgentinaTransfers;
      tax_id?: string | null;
    } | null
  };
  
export type PayinTrackingPayment = {
    step: TrackingStatus
    provider_name?: string | null
    completed_at?: string | null
  };
  
export type PayinTrackingComplete = {
    step: TrackingStatus
    transaction_hash?: string | null;
    completed_at?: string | null;
  };
  
export type PayinTrackingPartnerFee = {
    step: TrackingStatus
    transaction_hash?: string | null
    completed_at?: string | null
  } 

export type PayinPaymentMethod = "ach" | "wire" | "pix" | "spei" | "transfers" | "pse" | "international_swift" | "rtp"

export type BusinessIndustry =
    | "111998"
    | "112120"
    | "113310"
    | "115114"
    | "211120"
    | "212114"
    | "213112"
    | "221310"
    | "236115"
    | "236220"
    | "237310"
    | "238210"
    | "311421"
    | "312130"
    | "313110"
    | "315990"
    | "322220"
    | "325412"
    | "334111"
    | "334118"
    | "334210"
    | "336110"
    | "336111"
    | "336390"
    | "337121"
    | "339112"
    | "339910"
    | "339920"
    | "339930"
    | "423110"
    | "423430"
    | "423510"
    | "423690"
    | "423830"
    | "423840"
    | "423940"
    | "424210"
    | "424410"
    | "424480"
    | "424690"
    | "424990"
    | "444110"
    | "445110"
    | "445320"
    | "449210"
    | "454110"
    | "455110"
    | "455219"
    | "456110"
    | "457110"
    | "458110"
    | "458210"
    | "458310"
    | "459120"
    | "459210"
    | "481111"
    | "483111"
    | "484121"
    | "485210"
    | "488510"
    | "493110"
    | "511210"
    | "512250"
    | "513130"
    | "516120"
    | "517110"
    | "517111"
    | "517112"
    | "517410"
    | "518210"
    | "519130"
    | "522110"
    | "522210"
    | "522320"
    | "523110"
    | "523150"
    | "523920"
    | "523940"
    | "523999"
    | "524113"
    | "531110"
    | "531120"
    | "531130"
    | "531190"
    | "531210"
    | "531311"
    | "531312"
    | "531320"
    | "531390"
    | "532111"
    | "541110"
    | "541211"
    | "541214"
    | "541330"
    | "541430"
    | "541511"
    | "541512"
    | "541519"
    | "541611"
    | "541618"
    | "541715"
    | "541810"
    | "541922"
    | "541930"
    | "541940"
    | "541990"
    | "551112"
    | "561311"
    | "561422"
    | "561499"
    | "561510"
    | "561612"
    | "561730"
    | "561740"
    | "562111"
    | "562920"
    | "611110"
    | "611310"
    | "611410"
    | "611710"
    | "621111"
    | "621210"
    | "621399"
    | "621511"
    | "621910"
    | "622110"
    | "623110"
    | "623220"
    | "624410"
    | "711110"
    | "711211"
    | "711410"
    | "711510"
    | "712110"
    | "713110"
    | "713210"
    | "721110"
    | "722511"
    | "722513"
    | "811111"
    | "811210"
    | "812111"
    | "812112"
    | "812199"
    | "813110"
    | "813211"
    | "813219"
    | "dapp"
    | "exchange"
    | "gambling"
    | "gaming"
    | "infra"
    | "marketplace"
    | "neo_bank"
    | "other"
    | "saas"
    | "social"
    | "wallet";

export type AccountPurpose =
    | "charitable_donations"
    | "ecommerce_retail_payments"
    | "investment_purposes"
    | "business_expenses"
    | "payments_to_friends_or_family_abroad"
    | "personal_or_living_expenses"
    | "protect_wealth"
    | "purchase_goods_and_services"
    | "receive_payments_for_goods_and_services"
    | "tax_optimization"
    | "third_party_money_transmission"
    | "payroll"
    | "treasury_management"
    | "other";

export type BusinessType =
    | "corporation"
    | "llc"
    | "partnership"
    | "sole_proprietorship"
    | "trust"
    | "non_profit";

export type EstimatedAnnualRevenue =
    | "0_99999"
    | "100000_999999"
    | "1000000_9999999"
    | "10000000_49999999"
    | "50000000_249999999"
    | "2500000000_plus";

export type SourceOfWealth =
    | "business_dividends_or_profits"
    | "investments"
    | "asset_sales"
    | "client_investor_contributions"
    | "gambling"
    | "charitable_contributions"
    | "inheritance"
    | "affiliate_or_royalty_income";

export type BankingPartner = "jpmorgan" | "citi" | "hsbc" | "cfsb";

export type SoleProprietorDocType = "master_service_agreement" | "salary_slip" | "bank_statement";

export type RecipientRelationship =
    | "first_party"
    | "employee"
    | "independent_contractor"
    | "vendor_or_supplier"
    | "subsidiary_or_affiliate"
    | "customer"
    | "merchant_or_partner"
    | "landlord"
    | "family"
    | "other";

export type PurposeOfTransactions =
    | "business_transactions"
    | "charitable_donations"
    | "investment_purposes"
    | "payments_to_friends_or_family_abroad"
    | "personal_or_living_expenses"
    | "protect_wealth"
    | "purchase_good_and_services"
    | "receive_payment_for_freelancing"
    | "receive_salary"
    | "other";

export type SourceOfFundsDocType =
    | "business_income"
    | "esops"
    | "gambling_proceeds"
    | "gifts"
    | "government_benefits"
    | "inheritance"
    | "investment_loans"
    | "investment_proceeds"
    | "pension_retirement"
    | "salary"
    | "sale_of_assets_real_estate"
    | "savings"
    | "someone_else_funds";

export type PaymentMethod = "ach" | "wire" | "pix" | "spei" | "transfers" | "pse" | "international_swift" | "rtp";

export type PayerRules = {
    pix_allowed_tax_ids?: string[] | null;
    transfers_allowed_tax_id?: string | null;
    pse_allowed_tax_ids?: string[] | null;
    pse_full_name?: string | null;
    pse_document_type?: Extract<AchCopDocument, 'CC' | 'NIT'> | null;
    pse_document_number?: string | null;
    pse_email?: string | null;
    pse_phone?: string | null;
    pse_bank_code?: string | null;
}

export type TrackingStatus = 'processing' | 'on_hold' | 'completed' | 'pending_review';

export type EstimatedTimeOfArrival = '5_min' | '30_min' | '2_hours' | '1_business_day' | '2_business_days' | '5_business_days';

export type PayoutTrackingTransaction = {
    step: TrackingStatus
    status: 'failed' | 'found';
    transaction_hash: string | null
    completed_at: string | null
  };
  
export type PayoutTrackingPayment = {
    step: TrackingStatus
    provider_name: string | null ;
    provider_transaction_id: string | null ;
    provider_status: 'canceled' | 'failed' | 'returned' | 'sent' | null
    recipient_name: string | null ;
    recipient_tax_id: string | null ;
    recipient_bank_code: string | null ;
    recipient_branch_code: string | null ;
    recipient_account_number: string | null ;
    recipient_account_type: string | null ;
    estimated_time_of_arrival: EstimatedTimeOfArrival | null ;
    completed_at: string | null ;
  };
  
export type PayoutTrackingLiquidity = {
    step: TrackingStatus
    provider_transaction_id: string | null ;
    provider_status: 'deposited' | 'converted' | 'withdrawn' | null;
    estimated_time_of_arrival: EstimatedTimeOfArrival | null;
    completed_at: string | null ;
  }
  
export type PayoutTrackingComplete = {
    step: TrackingStatus
    status: 'tokens_refunded' | 'paid' | null;
    transaction_hash: string | null;
    completed_at: string | null;
  };

export type PayoutTrackingPartnerFee = {
    step: TrackingStatus
    transaction_hash: string | null;
    completed_at: string | null;
  }