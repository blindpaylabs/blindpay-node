---
"@blindpay/node": minor
---

Update receiver creation according to API reference

- Add new enum types: `AccountPurpose`, `BusinessType`, `BusinessIndustry`, `EstimatedAnnualRevenue`, `SourceOfWealth`
- Update `Owner` type with `ownership_percentage` and `title` fields
- Make only `country` and `email` required in create input types, all other fields optional/nullable
- Add new optional fields to individual receiver types: `account_purpose`, `selfie_file`, `source_of_wealth`
- Add new optional fields to business receiver type: `account_purpose`, `business_description`, `business_industry`, `business_type`, `estimated_annual_revenue`, `publicly_traded`, `source_of_wealth`
