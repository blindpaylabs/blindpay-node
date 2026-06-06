---
"@blindpay/node": major
---

Remove the deprecated `receivers` resource and rename Customer-prefixed types to their canonical names now that the collision with receivers is gone. All callers must migrate to `customers`. Method signatures match what `receivers` exposed; the accessor name and field names (`receiver_id` → `customer_id`) change, and types like `CustomerOwner`, `CreateCustomerIndividualWithStandardKYCInput`, `GetCustomerLimitIncreaseRequestsResponse`, etc., are renamed to `Owner`, `CreateIndividualWithStandardKYCInput`, `GetLimitIncreaseRequestsResponse`. See https://www.blindpay.com/changelog/2026-06-04-customers-rename
