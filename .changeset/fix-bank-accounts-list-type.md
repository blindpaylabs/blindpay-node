---
"@blindpay/node": patch
---

Fix `ListBankAccountsResponse` type to match the actual API response. The API returns a plain array of bank accounts, not `{ data: [...] }`. Code using `result.data.data.forEach(...)` based on the previous type was getting `undefined` at runtime — now it correctly types as `Array<...>` and consumers can iterate `result.data.forEach(...)`.

Found via live QA against `@blindpay/node` v4.0.0 — `customers.bankAccounts.list()` returned 4 bank accounts but the SDK type made consumers access `.data.data` which was `undefined`.
