# API Changes (SDK-relevant)

## New Endpoints

- **POST /v1/instances/{id}/ownership** — Migrate Instance Ownership
  Request body (MigrateInstanceOwnershipIn):
    - user_id (string, required)
  Response (Success):
    - success (boolean)

- **POST /v1/instances/{instance_id}/customers** — Create Customer
  Request body (CreateReceiverIn):
    - type (string, enum: individual | business, required)
    - kyc_type (string, enum: light | standard | enhanced, required)
    - email (string, format: email, required)
    - tax_id (string/null, optional)
    - address_line_1 (string/null, optional)
    - address_line_2 (string/null, optional)
    - city (string/null, optional)
    - state_province_region (string/null, optional)
    - country (string, enum: 249 values, required)
    - postal_code (string/null, optional)
    - ip_address (string/null, format: ip, optional)
    - image_url (string/null, format: uri, optional)
    - phone_number (string/null, optional)
    - proof_of_address_doc_type (string/null, enum: UTILITY_BILL | BANK_STATEMENT | RENTAL_AGREEMENT | TAX_DOCUMENT | GOVERNMENT_CORRESPONDENCE, optional)
    - proof_of_address_doc_file (string/null, format: uri, optional)
    - first_name (string/null, optional)
    - last_name (string/null, optional)
    - date_of_birth (unknown, optional)
    - id_doc_country (string/null, enum: 249 values, optional)
    - id_doc_type (string/null, enum: PASSPORT | ID_CARD | DRIVERS, optional)
    - id_doc_front_file (string/null, format: uri, optional)
    - id_doc_back_file (string/null, format: uri, optional)
    - legal_name (string/null, optional)
    - alternate_name (string/null, optional)
    - formation_date (unknown, format: date-time, optional)
    - website (string/null, format: uri, optional)
    - owners (array/null, items: object, optional)
    - incorporation_doc_file (string/null, format: uri, optional)
    - proof_of_ownership_doc_file (string/null, format: uri, optional)
    - source_of_funds_doc_type (string/null, enum: 13 values, optional)
    - source_of_funds_doc_file (string/null, format: uri, optional)
    - selfie_file (string/null, format: uri, optional)
    - purpose_of_transactions (string/null, enum: business_transactions | charitable_donations | investment_purposes | payments_to_friends_or_family_abroad | personal_or_living_expenses | protect_wealth | purchase_good_and_services | receive_payment_for_freelancing | receive_salary | other, optional)
    - purpose_of_transactions_explanation (string/null, optional)
    - account_purpose (string/null, enum: 14 values, optional)
    - account_purpose_other (string/null, optional)
    - business_type (string/null, enum: corporation | llc | partnership | sole_proprietorship | trust | non_profit, optional)
    - business_description (string/null, optional)
    - business_industry (string/null, enum: 144 values, optional)
    - estimated_annual_revenue (string/null, enum: 0_99999 | 100000_999999 | 1000000_9999999 | 10000000_49999999 | 50000000_249999999 | 250000000_plus, optional)
    - source_of_wealth (string/null, enum: business_dividends_or_profits | investments | asset_sales | client_investor_contributions | gambling | charitable_contributions | inheritance | affiliate_or_royalty_income, optional)
    - publicly_traded (boolean/null, optional)
    - occupation (string/null, optional)
    - external_id (string/null, optional)
    - tos_id (string/null, optional)
    - additional_info (array/null, items: AdditionalInfoItem, optional)
  Response (inline):
    - id (string)
    - customer_id (string)
- **GET /v1/instances/{instance_id}/customers** — Retrieve Customers

- **POST /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts** — Add Bank Account
  Request body (CreateBankAccountIn):
    - type (string, enum: 11 values, required)
    - name (string, required)
    - status (string/null, enum: verifying | approved | rejected | deprecated, optional)
    - recipient_relationship (string/null, enum: first_party | employee | independent_contractor | vendor_or_supplier | subsidiary_or_affiliate | merchant_or_partner | customer | landlord | family | other, optional)
    - swift_payment_code (string/null, enum: 1025 values, optional)
    - pix_key (string/null, optional)
    - force_cpf_cnpj (boolean/null, optional)
    - beneficiary_name (string/null, optional)
    - routing_number (string/null, optional)
    - account_number (string/null, optional)
    - account_type (string/null, enum: checking | saving, optional)
    - account_class (string/null, enum: individual | business, optional)
    - address_line_1 (string/null, optional)
    - address_line_2 (string/null, optional)
    - city (string/null, optional)
    - state_province_region (string/null, optional)
    - country (string/null, enum: 249 values, optional)
    - postal_code (string/null, optional)
    - checkbook_account_id (string/null, optional)
    - checkbook_user_key (string/null, optional)
    - onemoney_external_account_id (string/null, optional)
    - pix_safe_bank_code (string/null, optional)
    - pix_safe_branch_code (string/null, optional)
    - pix_safe_cpf_cnpj (string/null, optional)
    - ted_bank_code (string/null, optional)
    - ted_branch_code (string/null, optional)
    - ted_cpf_cnpj (string/null, optional)
    - spei_protocol (string/null, enum: clabe | debitcard | phonenum, optional)
    - spei_institution_code (string/null, optional)
    - spei_clabe (string/null, optional)
    - transfers_type (string/null, enum: CVU | CBU | ALIAS, optional)
    - transfers_account (string/null, optional)
    - ach_cop_beneficiary_first_name (string/null, optional)
    - ach_cop_beneficiary_last_name (string/null, optional)
    - ach_cop_document_id (string/null, optional)
    - ach_cop_document_type (string/null, enum: CC | CE | NIT | PASS | PEP, optional)
    - ach_cop_email (string/null, optional)
    - ach_cop_bank_code (string/null, optional)
    - ach_cop_bank_account (string/null, optional)
    - swift_code_bic (string/null, optional)
    - swift_account_holder_name (string/null, optional)
    - swift_account_number_iban (string/null, optional)
    - swift_beneficiary_address_line_1 (string/null, optional)
    - swift_beneficiary_address_line_2 (string/null, optional)
    - swift_beneficiary_country (string/null, enum: 249 values, optional)
    - swift_beneficiary_city (string/null, optional)
    - swift_beneficiary_state_province_region (string/null, optional)
    - swift_beneficiary_postal_code (string/null, optional)
    - swift_bank_name (string/null, optional)
    - swift_bank_address_line_1 (string/null, optional)
    - swift_bank_address_line_2 (string/null, optional)
    - swift_bank_country (string/null, enum: 249 values, optional)
    - swift_bank_city (string/null, optional)
    - swift_bank_state_province_region (string/null, optional)
    - swift_bank_postal_code (string/null, optional)
    - swift_ifsc_branch_code (string/null, optional)
    - swift_intermediary_bank_swift_code_bic (unknown, optional)
    - swift_intermediary_bank_account_number_iban (string/null, optional)
    - swift_intermediary_bank_name (string/null, optional)
    - swift_intermediary_bank_country (string/null, enum: 249 values, optional)
    - sepa_iban (string/null, optional)
    - sepa_beneficiary_bic (string/null, optional)
    - sepa_beneficiary_legal_name (string/null, optional)
    - sepa_beneficiary_address_line_1 (string/null, optional)
    - sepa_beneficiary_address_line_2 (string/null, optional)
    - sepa_beneficiary_city (string/null, optional)
    - sepa_beneficiary_state_province_region (string/null, optional)
    - sepa_beneficiary_postal_code (string/null, optional)
    - sepa_beneficiary_country (string/null, enum: 249 values, optional)
    - business_industry (string/null, enum: 144 values, optional)
    - phone_number (string/null, optional)
    - tax_id (string/null, optional)
    - date_of_birth (unknown, optional)
  Response (BankAccountOut):
    - id (string)
    - type (string, enum: 11 values)
    - name (string)
    - pix_key (string/null)
    - beneficiary_name (string/null)
    - routing_number (string/null)
    - account_number (string/null)
    - account_type (string/null, enum: checking | saving)
    - account_class (string/null, enum: individual | business)
    - address_line_1 (string/null)
    - address_line_2 (string/null)
    - city (string/null)
    - state_province_region (string/null)
    - country (string/null, enum: 249 values)
    - postal_code (string/null)
    - spei_protocol (string/null, enum: clabe | debitcard | phonenum)
    - spei_institution_code (string/null)
    - spei_clabe (string/null)
    - transfers_type (string/null, enum: CVU | CBU | ALIAS)
    - transfers_account (string/null)
    - ... and 53 more fields
- **GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts** — Retrieve Bank Accounts

- **POST /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{bank_account_id}/offramp-wallets** — Create Offramp Wallet
  Request body (inline):
    - external_id (string/null, optional)
    - network (string, enum: 11 values, required)
  Response (inline):
    - id (string)
    - external_id (string/null)
    - circle_wallet_id (string/null)
    - network (string, enum: 11 values)
    - address (string)
- **GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{bank_account_id}/offramp-wallets** — Get Offramp Wallets

- **GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{bank_account_id}/offramp-wallets/{id}** — Get Offramp Wallet
  Response (OfframpWallet):
    - id (string)
    - external_id (string/null)
    - instance_id (string)
    - receiver_id (string)
    - bank_account_id (string)
    - circle_wallet_id (string/null)
    - network (string, enum: 11 values)
    - address (string)
    - created_at (unknown)
    - updated_at (unknown)

- **GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{id}** — Retrieve Bank Account
  Response (BankAccountOut):
    - id (string)
    - type (string, enum: 11 values)
    - name (string)
    - pix_key (string/null)
    - beneficiary_name (string/null)
    - routing_number (string/null)
    - account_number (string/null)
    - account_type (string/null, enum: checking | saving)
    - account_class (string/null, enum: individual | business)
    - address_line_1 (string/null)
    - address_line_2 (string/null)
    - city (string/null)
    - state_province_region (string/null)
    - country (string/null, enum: 249 values)
    - postal_code (string/null)
    - spei_protocol (string/null, enum: clabe | debitcard | phonenum)
    - spei_institution_code (string/null)
    - spei_clabe (string/null)
    - transfers_type (string/null, enum: CVU | CBU | ALIAS)
    - transfers_account (string/null)
    - ... and 53 more fields
- **DELETE /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{id}** — Remove Bank Account
  Response (Success):
    - success (boolean)

- **POST /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets** — Add Blockchain Wallet
  Request body (CreateBlockchainWalletIn):
    - name (string, required)
    - network (string, enum: 13 values, required)
    - signature_tx_hash (string/null, optional)
    - address (string/null, optional)
    - is_account_abstraction (boolean/null, optional)
  Response (BlockchainWalletOut):
    - id (string)
    - name (string)
    - network (string, enum: 13 values)
    - address (string/null)
    - signature_tx_hash (string/null)
    - is_account_abstraction (boolean/null)
    - receiver_id (string)
- **GET /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets** — Retrieve Blockchain Wallets

- **GET /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/sign-message** — Retrieve Blockchain Wallet Message
  Response (BlockchainWalletMessageOut):
    - message (string)

- **GET /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/{id}** — Retrieve Blockchain Wallet
  Response (BlockchainWalletOut):
    - id (string)
    - name (string)
    - network (string, enum: 13 values)
    - address (string/null)
    - signature_tx_hash (string/null)
    - is_account_abstraction (boolean/null)
    - receiver_id (string)
- **DELETE /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/{id}** — Remove Blockchain Wallet
  Response (Success):
    - success (boolean)

- **POST /v1/instances/{instance_id}/customers/{customer_id}/limit-increase** — Request Limit Increase
  Request body (ReceiverLimitIncreaseIn):
    - per_transaction (integer/null, required)
    - daily (integer/null, required)
    - monthly (integer/null, required)
    - supporting_document_type (string, enum: individual_bank_statement | individual_tax_return | individual_proof_of_income | business_bank_statement | business_financial_statements | business_tax_return, required)
    - supporting_document_file (string, format: uri, required)
  Response (ReceiverLimitIncreaseOut):
    - id (string)
- **GET /v1/instances/{instance_id}/customers/{customer_id}/limit-increase** — Retrieve Limit Increase Requests

- **GET /v1/instances/{instance_id}/customers/{customer_id}/rfi** — Get Open RFI for Customer
  Response (Rfi):
    - id (string)
    - receiver_id (string)
    - instance_id (string)
    - status (string, enum: pending | submitted | expired | cancelled)
    - request (array, items: RfiSection)
    - response (object)
    - expires_at (string, format: date-time)
    - submitted_at (string/null, format: date-time)
    - created_at (string, format: date-time)
    - receiver_type (string, enum: individual | business)
    - receiver_aiprise_session_id (string/null)
    - receiver_aiprise_user_profile_id (string/null)
    - receiver_kyc_status (string)
- **POST /v1/instances/{instance_id}/customers/{customer_id}/rfi** — Submit RFI Response

- **POST /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts** — Create Virtual Account
  Request body (CreateVirtualAccountIn):
    - banking_partner (string, enum: jpmorgan | citi | hsbc | cfsb, required)
    - token (string, enum: USDC | USDT | USDB, required)
    - blockchain_wallet_id (string, required)
    - sole_proprietor_doc_type (string/null, enum: master_service_agreement | salary_slip | bank_statement, optional)
    - sole_proprietor_doc_file (string/null, format: uri, optional)
  Response (VirtualAccountOut):
    - id (string)
    - banking_partner (string, enum: jpmorgan | citi | hsbc | cfsb)
    - kyc_status (string, enum: verifying | approved | rejected | deprecated | pending_review | awaiting_contract | compliance_request)
    - us (object)
    - token (string, enum: USDC | USDT | USDB)
    - blockchain_wallet_id (string/null)
    - blockchain_wallet (object/null)
- **GET /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts** — Retrieve Virtual Accounts

- **GET /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts/{id}** — Retrieve Virtual Account
- **PUT /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts/{id}** — Update Virtual Account
  Request body (UpdateVirtualAccountIn):
    - token (string, enum: USDC | USDT | USDB, required)
    - blockchain_wallet_id (string, required)
  Response (Success):
    - success (boolean)

- **POST /v1/instances/{instance_id}/customers/{customer_id}/wallets** — Create Wallet
  Request body (CreateWalletIn):
    - network (string, enum: 13 values, required)
    - external_id (string/null, optional)
    - name (string, required)
  Response (WalletOut):
    - id (string)
    - name (string)
    - external_id (string/null)
    - address (string/null)
    - network (string, enum: 13 values)
    - created_at (unknown)
- **GET /v1/instances/{instance_id}/customers/{customer_id}/wallets** — Retrieve Wallets

- **GET /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}** — Retrieve Wallet
  Response (WalletOut):
    - id (string)
    - name (string)
    - external_id (string/null)
    - address (string/null)
    - network (string, enum: 13 values)
    - created_at (unknown)
- **DELETE /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}** — Remove Wallet
  Response (Success):
    - success (boolean)

- **GET /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}/balance** — Retrieve Wallet Balance
  Response (WalletBalanceOut):
    - USDC (object)
    - USDT (object)
    - USDB (object)

- **GET /v1/instances/{instance_id}/customers/{id}** — Retrieve Customer
- **PUT /v1/instances/{instance_id}/customers/{id}** — Update Customer
  Request body (UpdateReceiverIn):
    - email (string, format: email, required)
    - tax_id (string/null, optional)
    - address_line_1 (string/null, optional)
    - address_line_2 (string/null, optional)
    - city (string/null, optional)
    - state_province_region (string/null, optional)
    - country (string, enum: 249 values, required)
    - postal_code (string/null, optional)
    - ip_address (string/null, format: ip, optional)
    - image_url (string/null, format: uri, optional)
    - phone_number (string/null, optional)
    - proof_of_address_doc_type (string/null, enum: UTILITY_BILL | BANK_STATEMENT | RENTAL_AGREEMENT | TAX_DOCUMENT | GOVERNMENT_CORRESPONDENCE, optional)
    - proof_of_address_doc_file (string/null, format: uri, optional)
    - first_name (string/null, optional)
    - last_name (string/null, optional)
    - date_of_birth (unknown, optional)
    - id_doc_country (string/null, enum: 249 values, optional)
    - id_doc_type (string/null, enum: PASSPORT | ID_CARD | DRIVERS, optional)
    - id_doc_front_file (string/null, format: uri, optional)
    - id_doc_back_file (string/null, format: uri, optional)
    - legal_name (string/null, optional)
    - alternate_name (string/null, optional)
    - formation_date (unknown, format: date-time, optional)
    - website (string/null, format: uri, optional)
    - owners (array/null, items: object, optional)
    - incorporation_doc_file (string/null, format: uri, optional)
    - proof_of_ownership_doc_file (string/null, format: uri, optional)
    - source_of_funds_doc_type (string/null, enum: 13 values, optional)
    - source_of_funds_doc_file (string/null, format: uri, optional)
    - selfie_file (string/null, format: uri, optional)
    - purpose_of_transactions (string/null, enum: business_transactions | charitable_donations | investment_purposes | payments_to_friends_or_family_abroad | personal_or_living_expenses | protect_wealth | purchase_good_and_services | receive_payment_for_freelancing | receive_salary | other, optional)
    - purpose_of_transactions_explanation (string/null, optional)
    - account_purpose (string/null, enum: 14 values, optional)
    - account_purpose_other (string/null, optional)
    - business_type (string/null, enum: corporation | llc | partnership | sole_proprietorship | trust | non_profit, optional)
    - business_description (string/null, optional)
    - business_industry (string/null, enum: 144 values, optional)
    - estimated_annual_revenue (string/null, enum: 0_99999 | 100000_999999 | 1000000_9999999 | 10000000_49999999 | 50000000_249999999 | 250000000_plus, optional)
    - source_of_wealth (string/null, enum: business_dividends_or_profits | investments | asset_sales | client_investor_contributions | gambling | charitable_contributions | inheritance | affiliate_or_royalty_income, optional)
    - publicly_traded (boolean/null, optional)
    - occupation (string/null, optional)
    - external_id (string/null, optional)
    - tos_id (string/null, optional)
    - additional_info (array/null, items: AdditionalInfoItem, optional)
  Response (Success):
    - success (boolean)
- **DELETE /v1/instances/{instance_id}/customers/{id}** — Delete Customer
  Response (Success):
    - success (boolean)

- **GET /v1/instances/{instance_id}/limits/customers/{id}** — Retrieve Customer Limits
  Response (GetReceiverLimitsOut):
    - limits (object)

## Removed Endpoints

- **GET /v1/instances/{instance_id}/limits/receivers/{id}**
- **POST /v1/instances/{instance_id}/receivers**
- **GET /v1/instances/{instance_id}/receivers**
- **GET /v1/instances/{instance_id}/receivers/{id}**
- **PUT /v1/instances/{instance_id}/receivers/{id}**
- **DELETE /v1/instances/{instance_id}/receivers/{id}**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{bank_account_id}/offramp-wallets**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{bank_account_id}/offramp-wallets**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{bank_account_id}/offramp-wallets/{id}**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{id}**
- **DELETE /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{id}**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/blockchain-wallets**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/blockchain-wallets**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/blockchain-wallets/sign-message**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/blockchain-wallets/{id}**
- **DELETE /v1/instances/{instance_id}/receivers/{receiver_id}/blockchain-wallets/{id}**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/limit-increase**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/limit-increase**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/rfi**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/rfi**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/virtual-accounts**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/virtual-accounts**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/virtual-accounts/{id}**
- **PUT /v1/instances/{instance_id}/receivers/{receiver_id}/virtual-accounts/{id}**
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/wallets**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/wallets**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/wallets/{id}**
- **DELETE /v1/instances/{instance_id}/receivers/{receiver_id}/wallets/{id}**
- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/wallets/{id}/balance**

## Modified Endpoints

### /v1/e/payins/{id}

  Response (PayinOut) [GET]:
  - ENUM manual_execution_status: added 1 values: failed

### /v1/e/payouts/{id}

  Response (PayoutOut) [GET]:
  - ADDED field: billing_fee_amount (number/null, optional)
  - ADDED field: cpn_payment_id (string/null, optional)
  - ADDED field: sender_legal_name (string/null, optional)

### /v1/instances/{instance_id}/payins/{id}

  Response (PayinOut) [GET]:
  - ENUM manual_execution_status: added 1 values: failed

### /v1/instances/{instance_id}/payouts/{id}

  Response (PayoutOut) [GET]:
  - ADDED field: billing_fee_amount (number/null, optional)
  - ADDED field: cpn_payment_id (string/null, optional)
  - ADDED field: sender_legal_name (string/null, optional)

## Enum Value Changes

These enum fields gained or lost values across all schemas:

  - aiprise_document_type: ADDED 7 values: ADDRESS_PROOF_DOCUMENT, BANK_STATEMENT_DOCUMENT, OTHER, SOURCE_OF_FUNDS_DOCUMENT, TAX_CERTIFICATE, USER_SELFIE, VISA_DOCUMENT
  - manual_execution_status: ADDED 1 values: failed
  - webhook_event: ADDED 1 values: receiver.delete

## New Schemas

- **CopyInstanceMembersIn** (1 fields)
- **CopyInstanceMembersOut** (3 fields)
- **MigrateInstanceOwnershipIn** (1 fields)
- **ReceiverDeleteWebhookOut** (7 fields)
