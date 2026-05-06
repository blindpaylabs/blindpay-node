# API Changes (SDK-relevant)

## Removed Endpoints

- **POST /v1/instances/{instance_id}/vouchers**
- **GET /v1/instances/{instance_id}/vouchers**
- **GET /v1/instances/{instance_id}/vouchers/{id}**
- **PATCH /v1/instances/{instance_id}/vouchers/{id}**
- **DELETE /v1/instances/{instance_id}/vouchers/{id}**

## Modified Endpoints

### /v1/e/payins/{id}

  Response (PayinOut) [GET]:
  - ADDED field: partner_fee_id (string/null, optional)
  - ENUM payment_method: added 2 values: rtp, ted

### /v1/e/payouts/{id}

  Response (PayoutOut) [GET]:
  - ADDED field: partner_fee_id (string/null, optional)
  - ADDED field: ted_bank_code (string/null, optional)
  - ADDED field: ted_branch_code (string/null, optional)
  - ADDED field: ted_cpf_cnpj (string/null, optional)
  - ENUM type: added 1 values: ted

### /v1/instances/{id}

  Request body (UpdateInstanceIn) [PUT]:
  - REMOVED field: wallets_and_transfers

### /v1/instances/{instance_id}/billing/fees

  Response (GetFeesOut) [GET]:
  - ADDED field: ted (unknown, optional)

### /v1/instances/{instance_id}/payin-quotes

  Request body (CreatePayinQuoteIn) [POST]:
  - ENUM payment_method: added 2 values: rtp, ted

### /v1/instances/{instance_id}/payins/evm

  Response (CreatePayinOut) [POST]:
  - ENUM payment_method: added 2 values: rtp, ted

### /v1/instances/{instance_id}/payins/{id}

  Response (PayinOut) [GET]:
  - ADDED field: partner_fee_id (string/null, optional)
  - ENUM payment_method: added 2 values: rtp, ted

### /v1/instances/{instance_id}/payouts/{id}

  Response (PayoutOut) [GET]:
  - ADDED field: partner_fee_id (string/null, optional)
  - ADDED field: ted_bank_code (string/null, optional)
  - ADDED field: ted_branch_code (string/null, optional)
  - ADDED field: ted_cpf_cnpj (string/null, optional)
  - ENUM type: added 1 values: ted

### /v1/instances/{instance_id}/receivers/{id}

  Response (ReceiverOut) [GET]:
  - ENUM kyc_status: added 2 values: awaiting_contract, compliance_request

### /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts

  Request body (CreateBankAccountIn) [POST]:
  - ADDED field: ted_bank_code (string/null, optional)
  - ADDED field: ted_branch_code (string/null, optional)
  - ADDED field: ted_cpf_cnpj (string/null, optional)
  - ENUM swift_payment_code: added 34 values (too many to list)
  - ENUM type: added 1 values: ted
  Response (BankAccountOut) [POST]:
  - ADDED field: ted_bank_code (string/null, optional)
  - ADDED field: ted_branch_code (string/null, optional)
  - ADDED field: ted_cpf_cnpj (string/null, optional)
  - ENUM swift_payment_code: added 34 values (too many to list)
  - ENUM type: added 1 values: ted

### /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{id}

  Response (BankAccountOut) [GET]:
  - ADDED field: ted_bank_code (string/null, optional)
  - ADDED field: ted_branch_code (string/null, optional)
  - ADDED field: ted_cpf_cnpj (string/null, optional)
  - ENUM swift_payment_code: added 34 values (too many to list)
  - ENUM type: added 1 values: ted

### /v1/instances/{instance_id}/receivers/{receiver_id}/virtual-accounts

  Response (VirtualAccountOut) [POST]:
  - ENUM kyc_status: added 2 values: awaiting_contract, compliance_request

## Enum Value Changes

These enum fields gained or lost values across all schemas:

  - actor_type: ADDED 2 values: api_key, user
  - client_type: REMOVED 2 values: domestic, foreign
  - currency: REMOVED 2 values: USDC, USDT
  - decision: ADDED 2 values: approved, rejected
  - kyc_status: ADDED 2 values: awaiting_contract, compliance_request
  - operation: ADDED 3 values: create, delete, update
  - payment_method: ADDED 2 values: rtp, ted
  - receiver_type: ADDED 2 values: business, individual
  - status: ADDED 1 values: submitted; REMOVED 4 values: authorized, error, redeemed, revoked
  - swift_payment_code: ADDED 34 values

## New Schemas

- **AuditActor** (4 fields)
- **AuditLog** (17 fields)
- **AuditLogOut** (0 fields)
- **CreateFeedbackIn** (5 fields)
- **CreateRfiBody** (2 fields)
- **FeedbackActor** (3 fields)
- **FeedbackOut** (9 fields)
- **FeedbackWithActorOut** (0 fields)
- **KycDecisionBody** (3 fields)
- **Rfi** (12 fields)
- **RfiField** (6 fields)
- **RfiSection** (4 fields)

## Removed Schemas

- **CreateVoucherIn**
- **CreateVoucherOut**
- **GetNotasFiscaisSchemaOut**
- **NotaFiscalItem**
- **UpdateVoucherIn**
- **VoucherOut**
