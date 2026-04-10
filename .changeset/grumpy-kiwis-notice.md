---
"@blindpay/node": minor
---

Add missing resources, endpoints, and type updates to match API

- Add transfers resource (quotes, create, list, get, track)
- Add custodial wallets resource (create, list, get, balance, delete)
- Add fees resource
- Add upload resource
- Add payout document submission endpoint
- Add available NAICS codes endpoint
- Add `pix_safe` bank account type and creation method
- Update bank account inputs with new required fields (recipient_relationship, account_class, address)
- Update receiver `update` method from PATCH to PUT
- Add missing webhook events (transfers, virtual accounts, wallet, limit increase)
- Add `pix_safe` to Rail type, `international_swift` to PayinPaymentMethod
- Add `500` to pagination limit/offset options
