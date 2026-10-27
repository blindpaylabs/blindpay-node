---
"@blindpay/node": major
---

Customers, terms of service, upload and instances now match the API.

**Breaking:**

- `customers.update` requires `email` and `country`, as the API does.
- `UpdateCustomerInput.owners` is now `UpdateCustomerOwnerInput[]`: each owner needs the `id` of an existing owner, and every other field is optional. Before, the type had no way to send `id`, and the API rejects owners without one.
- `CreateBusinessWithStandardKYBInput.owners` is now `CreateCustomerOwnerInput[]`, which requires the fields the API requires (`tax_id` and `id_doc_front_file` can't be `null`) and makes `title`, `ownership_percentage`, `address_line_2`, `id_doc_back_file` and the proof of address fields optional.
- `GetCustomerResponse` and `ListCustomersResponse` now include `IndividualWithLightKYC` and `BusinessWithLightKYB`, the legacy `light` tier that migrated customers still carry. Code that narrows on `kyc_type` has to handle `"light"`.
- `date_of_birth` on individual customers and `formation_date` on business customers are now optional and can be `null`.
- Removed `aiprise_validation_key` from customer responses and `individual_holding_doc_front_file` from `IndividualWithEnhancedKYC`: the API never returns them.
- `BusinessIndustry` no longer includes `"336111"`, `"517110"`, `"523110"`, `"523920"` or the instance onboarding categories (`"dapp"`, `"exchange"`, `"gambling"`, `"gaming"`, `"infra"`, `"marketplace"`, `"neo_bank"`, `"other"`, `"saas"`, `"social"`, `"wallet"`). The API rejects them for customers and bank accounts. The onboarding categories stay in `InstanceBusinessIndustry`.
- `ListCustomersInput.status` is now `KycStatus` instead of `string`.
- `customers.update`, `customers.delete`, `instances.update`, `instances.delete`, `instances.deleteMember` and `instances.updateMemberRole` now resolve to `SuccessResponse` (`{ success: boolean }`) instead of `void`.

**Additive:**

- `upload.upload`, `upload.analyze` and `upload.presign` send the client's instance id when you don't pass `instance_id`. The API needs it for API key requests, and `PresignInput.instance_id` is now optional.
- `instances.tos.initiate` only requires `idempotency_key`; `customer_id` and `redirect_url` are optional.
- The create customer responses include `customer_id`.
- `BusinessWithStandardKYB` has `publicly_traded`.
- New exported types `CreateCustomerOwnerInput`, `UpdateCustomerOwnerInput`, `IndividualWithLightKYC`, `BusinessWithLightKYB` and `Customer` (the union of every customer variant).
- `MigrateInstanceOwnershipResponse` is now an alias of `SuccessResponse`.
