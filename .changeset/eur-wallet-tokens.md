---
"@blindpay/node": minor
---

Transfers and custodial wallet balances accept and report the EUR stablecoins.

- New shared type `WalletToken` (`"USDC" | "USDT" | "USDB" | "EURC" | "EURB"`) for tokens a custodial wallet holds or moves; the wallet deposits methods use it too.
- `CreateTransferQuoteInput.sender_token`/`customer_token`, `Transfer.sender_token`/`customer_token` and `WalletTokenBalance.symbol` now use `WalletToken`, so a transfer can convert between USDC and EURC (USDB and EURB on development instances).
