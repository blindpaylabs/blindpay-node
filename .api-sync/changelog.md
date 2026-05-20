# API Changes (SDK-relevant)

## New Endpoints

- **GET /v1/instances/{instance_id}/receivers/{receiver_id}/rfi** — Get Open RFI for Receiver
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
    - receiver_kyc_status (string)
- **POST /v1/instances/{instance_id}/receivers/{receiver_id}/rfi** — Submit RFI Response
  Response (inline):
    - success (boolean)

## Modified Endpoints

### /v1/e/payins/{id}

  Response (PayinOut) [GET]:
  - ADDED field: manual_concluded_at (unknown, optional)
  - ADDED field: manual_concluded_by (string/null, optional)
  - ADDED field: manual_execution_status (string/null, enum: pending | concluded, optional)
  - ENUM currency: added 1 values: EUR

### /v1/e/payouts/{id}

  Response (PayoutOut) [GET]:
  - ENUM currency: added 1 values: EUR
  - ENUM type: added 1 values: sepa

### /v1/instances/{instance_id}/billing/fees

  Response (GetFeesOut) [GET]:
  - ADDED field: sepa (object, required)

### /v1/instances/{instance_id}/payin-quotes/fx

  Request body (inline) [POST]:
  - ENUM from: added 1 values: EUR
  - ENUM to: added 1 values: EUR

### /v1/instances/{instance_id}/payins/{id}

  Response (PayinOut) [GET]:
  - ADDED field: manual_concluded_at (unknown, optional)
  - ADDED field: manual_concluded_by (string/null, optional)
  - ADDED field: manual_execution_status (string/null, enum: pending | concluded, optional)
  - ENUM currency: added 1 values: EUR

### /v1/instances/{instance_id}/payouts/{id}

  Response (PayoutOut) [GET]:
  - ENUM currency: added 1 values: EUR
  - ENUM type: added 1 values: sepa

### /v1/instances/{instance_id}/quotes/fx

  Request body (inline) [POST]:
  - ENUM to: added 1 values: EUR

### /v1/instances/{instance_id}/receivers

  Request body (CreateReceiverIn) [POST]:
  - ENUM business_industry: added 1 values: 446120

### /v1/instances/{instance_id}/receivers/{id}

  Response (ReceiverOut) [GET]:
  - ENUM business_industry: added 1 values: 446120
  Request body (UpdateReceiverIn) [PUT]:
  - ENUM business_industry: added 1 values: 446120

### /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts

  Request body (CreateBankAccountIn) [POST]:
  - ADDED field: sepa_beneficiary_address_line_1 (string/null, optional)
  - ADDED field: sepa_beneficiary_address_line_2 (string/null, optional)
  - ADDED field: sepa_beneficiary_city (string/null, optional)
  - ADDED field: sepa_beneficiary_country (string/null, enum: 249 values, optional)
  - ADDED field: sepa_beneficiary_legal_name (string/null, optional)
  - ADDED field: sepa_beneficiary_postal_code (string/null, optional)
  - ADDED field: sepa_beneficiary_state_province_region (string/null, optional)
  - ADDED field: sepa_iban (string/null, optional)
  - ADDED field: swift_ifsc_branch_code (string/null, optional)
  - ENUM business_industry: added 1 values: 446120
  - ENUM swift_payment_code: added 4 values: hk_swift_charitabledonation, hk_swift_goods, hk_swift_personal, hk_swift_services
  - ENUM type: added 1 values: sepa
  Response (BankAccountOut) [POST]:
  - ADDED field: sepa_beneficiary_address_line_1 (string/null, optional)
  - ADDED field: sepa_beneficiary_address_line_2 (string/null, optional)
  - ADDED field: sepa_beneficiary_city (string/null, optional)
  - ADDED field: sepa_beneficiary_country (string/null, enum: 249 values, optional)
  - ADDED field: sepa_beneficiary_legal_name (string/null, optional)
  - ADDED field: sepa_beneficiary_postal_code (string/null, optional)
  - ADDED field: sepa_beneficiary_state_province_region (string/null, optional)
  - ADDED field: sepa_iban (string/null, optional)
  - ADDED field: swift_ifsc_branch_code (string/null, optional)
  - ENUM business_industry: added 1 values: 446120
  - ENUM swift_payment_code: added 4 values: hk_swift_charitabledonation, hk_swift_goods, hk_swift_personal, hk_swift_services
  - ENUM type: added 1 values: sepa

### /v1/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{id}

  Response (BankAccountOut) [GET]:
  - ADDED field: sepa_beneficiary_address_line_1 (string/null, optional)
  - ADDED field: sepa_beneficiary_address_line_2 (string/null, optional)
  - ADDED field: sepa_beneficiary_city (string/null, optional)
  - ADDED field: sepa_beneficiary_country (string/null, enum: 249 values, optional)
  - ADDED field: sepa_beneficiary_legal_name (string/null, optional)
  - ADDED field: sepa_beneficiary_postal_code (string/null, optional)
  - ADDED field: sepa_beneficiary_state_province_region (string/null, optional)
  - ADDED field: sepa_iban (string/null, optional)
  - ADDED field: swift_ifsc_branch_code (string/null, optional)
  - ENUM business_industry: added 1 values: 446120
  - ENUM swift_payment_code: added 4 values: hk_swift_charitabledonation, hk_swift_goods, hk_swift_personal, hk_swift_services
  - ENUM type: added 1 values: sepa

## Enum Value Changes

These enum fields gained or lost values across all schemas:

  - business_industry: ADDED 1 values: 446120
  - currency: ADDED 1 values: EUR
  - decision: ADDED 2 values: approved, rejected
  - manual_execution_status: ADDED 2 values: concluded, pending
  - receiver_type: ADDED 2 values: business, individual
  - sepa_beneficiary_country: ADDED 249 values
  - swift_payment_code: ADDED 4 values: hk_swift_charitabledonation, hk_swift_goods, hk_swift_personal, hk_swift_services

## New Schemas

- **CreateComplaintIn** (5 fields)
- **CreateExternalReceiverTokenIn** (2 fields)
- **CreateInstanceOnboardingInviteIn** (1 fields)
- **ExternalOnboardingInfo** (3 fields)
- **KycDecisionBody** (3 fields)
- **UpdateDynamicRateOtcIn** (1 fields)
