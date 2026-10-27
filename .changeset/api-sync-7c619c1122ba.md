---
"@blindpay/node": minor
---

Sync SDK with API changes:

- add enum member "bre_b" to types/index.d.ts:PayinPaymentMethod (PayinOut.payment_method)
- add enum member "infinitus_portage" to types/index.d.ts:PayoutForcedProvider (PayoutOut.tracking_payment.forced_provider)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:CreateBusinessWithStandardKYBInput (CreateCustomerIn)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:CreateIndividualWithEnhancedKYCInput (CreateCustomerIn)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:CreateIndividualWithStandardKYCInput (CreateCustomerIn)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
- add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:UpdateCustomerInput (UpdateCustomerIn)
- add field "approved_risk_sources?: string[] | null" to types/index.d.ts:PayinTrackingPayment (PayinOut.tracking_payment)
- add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
- add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
- add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
- add field "billing_fee_amount?: number | null" to src/resources/payins/index.ts:CreateEvmPayinResponse (CreatePayinOut)
- add field "billing_fee_amount?: number | null" to src/resources/payins/quotes.ts:CreatePayinQuoteResponse (CreatePayinQuoteOut)
- add field "billing_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
- add field "billing_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
- add field "billing_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
- add field "billing_fee_amount?: number | null" to src/resources/quotes/index.ts:CreateQuoteResponse (QuoteOut)
- add field "business_type?: BusinessType | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
- add field "business_type?: BusinessType | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
- add field "business_type?: BusinessType | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
- add field "coelsa_id?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "compliance_emails?: string[] | null" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
- add field "customer_id?: string | null" to src/resources/virtual-accounts/index.ts:VirtualAccount (VirtualAccountOut)
- add field "customer_id?: string" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
- add field "customer_id?: string" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
- add field "customer_id?: string" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
- add field "customer_rfi_emails_enabled?: boolean" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
- add field "end_to_end_id?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
- add field "end_to_end_id?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "external_id?: string | null" to src/resources/transfers/index.ts:Transfer (TransferOut)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
- add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
- add field "has_passkey?: boolean | null" to src/resources/instances/index.ts:GetInstanceMembersResponse (get /v1/instances/{id}/members)
- add field "latitude?: number | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
- add field "latitude?: number | null" to src/resources/customers/index.ts:CreateBusinessWithStandardKYBInput (CreateCustomerIn)
- add field "latitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithEnhancedKYCInput (CreateCustomerIn)
- add field "latitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithStandardKYCInput (CreateCustomerIn)
- add field "latitude?: number | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
- add field "latitude?: number | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
- add field "latitude?: number | null" to src/resources/customers/index.ts:UpdateCustomerInput (UpdateCustomerIn)
- add field "ledger_in_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
- add field "ledger_out_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
- add field "longitude?: number | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
- add field "longitude?: number | null" to src/resources/customers/index.ts:CreateBusinessWithStandardKYBInput (CreateCustomerIn)
- add field "longitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithEnhancedKYCInput (CreateCustomerIn)
- add field "longitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithStandardKYCInput (CreateCustomerIn)
- add field "longitude?: number | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
- add field "longitude?: number | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
- add field "longitude?: number | null" to src/resources/customers/index.ts:UpdateCustomerInput (UpdateCustomerIn)
- add field "manual_concluded_at?: string" to src/resources/payins/index.ts:Payin (PayinOut)
- add field "manual_concluded_by?: string | null" to src/resources/payins/index.ts:Payin (PayinOut)
- add field "manual_execution_status?: "pending" | "concluded" | "failed" | null" to src/resources/payins/index.ts:Payin (PayinOut)
- add field "offramp_wallet_id?: string | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
- add field "offramp_wallet_id?: string | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
- add field "offramp_wallet_id?: string | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
- add field "partner_fee?: number" to src/resources/payins/index.ts:CreateEvmPayinResponse (CreatePayinOut)
- add field "partner_fee?: number" to src/resources/payins/index.ts:Payin (PayinOut)
- add field "partner_fee?: number" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
- add field "partner_fee?: number" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
- add field "partner_fee?: number" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
- add field "partner_fee?: number" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "pix_safe_bank_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "pix_safe_branch_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "pix_safe_cpf_cnpj?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "provider_clearing_system?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "provider_error_reason?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "provider_error_reason?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
- add field "provider_imad?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "provider_integration?: PayoutProviderIntegration | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "provider_name?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
- add field "provider_reference?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "provider_transaction_id?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
- add field "provider_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingComplete (PayoutOut.tracking_complete)
- add field "provider_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
- add field "provider_uetr?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
- add field "refund_reason?: string | null" to types/index.d.ts:PayoutTrackingComplete (PayoutOut.tracking_complete)
- add field "requiredWhen?: {
    field: "type" | "name" | "status" | "recipient_relationship" | "swift_payment_code" | "pix_key" | "force_cpf_cnpj" | "beneficiary_name" | "routing_number" | "account_number" | "account_type" | "account_class" | "address_line_1" | "address_line_2" | "city" | "state_province_region" | "country" | "postal_code" | "checkbook_account_id" | "checkbook_user_key" | "onemoney_external_account_id" | "pix_safe_bank_code" | "pix_safe_branch_code" | "pix_safe_cpf_cnpj" | "ted_bank_code" | "ted_branch_code" | "ted_cpf_cnpj" | "spei_protocol" | "spei_institution_code" | "spei_clabe" | "transfers_type" | "transfers_account" | "ach_cop_beneficiary_first_name" | "ach_cop_beneficiary_last_name" | "ach_cop_document_id" | "ach_cop_document_type" | "ach_cop_email" | "ach_cop_bank_code" | "ach_cop_bank_account" | "swift_code_bic" | "swift_account_holder_name" | "swift_account_number_iban" | "swift_beneficiary_address_line_1" | "swift_beneficiary_address_line_2" | "swift_beneficiary_country" | "swift_beneficiary_city" | "swift_beneficiary_state_province_region" | "swift_beneficiary_postal_code" | "swift_bank_name" | "swift_bank_address_line_1" | "swift_bank_address_line_2" | "swift_bank_country" | "swift_bank_city" | "swift_bank_state_province_region" | "swift_bank_postal_code" | "swift_ifsc_branch_code" | "swift_intermediary_bank_swift_code_bic" | "swift_intermediary_bank_account_number_iban" | "swift_intermediary_bank_name" | "swift_intermediary_bank_country" | "swift_intermediary_bank_routing_number" | "sepa_iban" | "sepa_beneficiary_bic" | "sepa_beneficiary_legal_name" | "sepa_beneficiary_address_line_1" | "sepa_beneficiary_address_line_2" | "sepa_beneficiary_city" | "sepa_beneficiary_state_province_region" | "sepa_beneficiary_postal_code" | "sepa_beneficiary_country" | "faster_payments_sort_code" | "faster_payments_account_number" | "faster_payments_beneficiary_legal_name" | "faster_payments_beneficiary_address_line_1" | "faster_payments_beneficiary_address_line_2" | "faster_payments_beneficiary_city" | "faster_payments_beneficiary_state_province_region" | "faster_payments_beneficiary_postal_code" | "faster_payments_beneficiary_country" | "business_industry" | "phone_number" | "tax_id" | "date_of_birth";
    operator: "in" | "eq" | "notIn" | "notEq";
    values: string[];
}" to src/resources/available/index.ts:GetBankDetailsResponse (AvailableBankDetails)
- add field "review_context?: Record<string, unknown> | null" to types/index.d.ts:PayinTrackingPayment (PayinOut.tracking_payment)
- add field "review_source?: string | null" to types/index.d.ts:PayinTrackingPayment (PayinOut.tracking_payment)
- add field "sender_bank_name?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
- add field "sender_legal_name?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "sepa?: FeeOptions" to src/resources/fees/index.ts:GetFeesResponse (GetFeesOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
- add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
- add field "ted_instruction?: {
    beneficiary_name: string;
    tax_id: string;
    bank_code: string;
    bank_name: string;
    branch_code: string;
    account_number: string;
    account_type: string;
} | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
- add field "tracking_documents?: {
    step: TrackingStatus;
    status?: "waiting_documents" | "compliance_reviewing" | null;
    reviewed_by?: string | null;
    completed_at?: string | null;
} | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
- add field "tracking_documents?: {
    step: TrackingStatus;
    status?: "waiting_documents" | "compliance_reviewing" | null;
    reviewed_by?: string | null;
    completed_at?: string | null;
} | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
- add field "tracking_documents?: {
    step: TrackingStatus;
    status?: "waiting_documents" | "compliance_reviewing" | null;
    reviewed_by?: string | null;
    completed_at?: string | null;
} | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
- add field "tracking_documents?: {
    step: TrackingStatus;
    status?: "waiting_documents" | "compliance_reviewing" | null;
    reviewed_by?: string | null;
    completed_at?: string | null;
} | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "transaction_fee_amount?: number | null" to src/resources/payins/index.ts:CreateEvmPayinResponse (CreatePayinOut)
- add field "transaction_fee_amount?: number | null" to src/resources/payins/index.ts:Payin (PayinOut)
- add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
- add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
- add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
- add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
- add field "transaction_hash?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
- add field "yield?: {
    blindpay_share_bps: number;
    partner_share_bps: number;
    partner_wallet_address?: string | null;
} | null" to src/resources/fees/index.ts:GetFeesResponse (GetFeesOut)
