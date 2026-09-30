---
"@blindpay/node": minor
---

Add self-custody support to external blockchain wallets. `is_self_custody` (`boolean | null`, null = never answered) is now returned on blockchain wallets and accepted as an optional input on `createWithAddress` and `createWithHash` (the API requires it for customers in Brazil). New `wallets.blockchain.setSelfCustody({ customer_id, id, is_self_custody })` records the answer once on an existing wallet. Adds the `blockchainWallet.update` webhook event.
