import { Country, TransferType } from "./util-types";

export enum BankDetailKey {
  TYPE = "type",
  NAME = "name",
  PIX_KEY = "pix_key",
  BENEFICIARY_NAME = "beneficiary_name",
  ROUTING_NUMBER = "routing_number",
  ACCOUNT_NUMBER = "account_number",
  ACCOUNT_TYPE = "account_type",
  ACCOUNT_CLASS = "account_class",
  ADDRESS_LINE_1 = "address_line_1",
  ADDRESS_LINE_2 = "address_line_2",
  CITY = "city",
  STATE_PROVINCE_REGION = "state_province_region",
  COUNTRY = "country",
  POSTAL_CODE = "postal_code",
  SPEI_PROTOCOL = "spei_protocol",
  SPEI_INSTITUTION_CODE = "spei_institution_code",
  SPEI_CLABE = "spei_clabe",
  TRANSFERS_TYPE = "transfers_type",
  TRANSFERS_ACCOUNT = "transfers_account",
  ACH_COP_BENEFICIARY_FIRST_NAME = "ach_cop_beneficiary_first_name",
  ACH_COP_BENEFICIARY_LAST_NAME = "ach_cop_beneficiary_last_name",
  ACH_COP_DOCUMENT_ID = "ach_cop_document_id",
  ACH_COP_DOCUMENT_TYPE = "ach_cop_document_type",
  ACH_COP_EMAIL = "ach_cop_email",
  ACH_COP_BANK_CODE = "ach_cop_bank_code",
  ACH_COP_BANK_ACCOUNT = "ach_cop_bank_account",
}

export interface BankDetailItem {
  label: string;
  value: string;
  is_active: boolean;
}

export interface BankDetail {
  label: string;
  regex: string;
  key: BankDetailKey;
  items?: BankDetailItem[];
  required: boolean | null;
}

export interface AvailableRail {
  label: string;
  value: TransferType;
  country: Country;
}

export interface AvailableCurrency {
  label: string;
  value: string;
}

export interface AvailableCountry {
  label: string;
  value: string;
}
