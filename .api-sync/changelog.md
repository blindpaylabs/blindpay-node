# API Changes (SDK-relevant)

## New Endpoints

- **POST /v1/presign** — Presign File URL
  Request body (PresignIn):
    - file_url (string, format: uri, required)
  Response (PresignOut):
    - file_url (string)
    - expires_at (string)

## New Schemas

- **PresignIn** (1 fields)
- **PresignOut** (2 fields)
