import { ReceiverType } from "./receiver-types";
import { Country, TransferType } from "./util-types";
export declare enum AccountType {
    CHECKING = "checking",
    SAVING = "saving"
}
export declare enum SpeiProtocol {
    CLABE = "clabe",
    DEBITCARD = "debitcard",
    PHONENUM = "phonenum"
}
export declare enum TransfersType {
    CVU = "CVU",
    CBU = "CBU",
    ALIAS = "ALIAS"
}
export declare enum AchCopDocumentType {
    CC = "CC",
    CE = "CE",
    NIT = "NIT",
    PASS = "PASS",
    PEP = "PEP"
}
interface BlockchainAddresses {
    sepolia: string;
    arbitrum_sepolia: string;
    base_sepolia: string;
    polygon_amoy: string;
    base: string;
    arbitrum: string;
    polygon: string;
}
interface BrexVendorId {
    id: string;
    instrument_id: string;
}
export interface CreateBankAccountRequest {
    type: TransferType;
    name: string;
    pix_key?: string;
    beneficiary_name?: string;
    routing_number?: string;
    account_number?: string;
    account_type?: AccountType;
    account_class?: ReceiverType;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state_province_region?: string;
    country?: Country;
    postal_code?: string;
    spei_protocol?: SpeiProtocol;
    spei_institution_code?: string;
    spei_clabe?: string;
    transfers_type?: TransfersType;
    transfers_account?: string;
    ach_cop_beneficiary_first_name?: string;
    ach_cop_beneficiary_last_name?: string;
    ach_cop_document_id?: string;
    ach_cop_document_type?: AchCopDocumentType;
    ach_cop_email?: string;
    ach_cop_bank_code?: string;
    ach_cop_bank_account?: string;
}
export interface BankAccountResponse {
    id: string;
    type: TransferType;
    name: string;
    pix_key?: string;
    beneficiary_name?: string;
    routing_number?: string;
    account_number?: string;
    account_type?: AccountType;
    account_class?: ReceiverType;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state_province_region?: string;
    country?: Country;
    postal_code?: string;
    blockchain_address: BlockchainAddresses;
    brex_vendor_id: BrexVendorId;
    spei_protocol?: SpeiProtocol;
    spei_institution_code?: string;
    spei_clabe?: string;
    transfers_type?: TransfersType;
    transfers_account?: string;
    ach_cop_beneficiary_first_name?: string;
    ach_cop_beneficiary_last_name?: string;
    ach_cop_document_id?: string;
    ach_cop_document_type?: AchCopDocumentType;
    ach_cop_email?: string;
    ach_cop_bank_code?: string;
    ach_cop_bank_account?: string;
    bitso_contact_id?: string;
}
export interface DeleteBankAccountResponse {
    success: boolean;
}
export {};
