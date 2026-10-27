# @blindpay/node

## 5.4.0

### Minor Changes

- [#78](https://github.com/blindpaylabs/blindpay-node/pull/78) [`2d0ece6`](https://github.com/blindpaylabs/blindpay-node/commit/2d0ece682e45811d34ceb520b52527cd27835076) Thanks [@juninhopo](https://github.com/juninhopo)! - Add self-custody support to external blockchain wallets. `is_self_custody` (`boolean | null`, null = never answered) is now returned on blockchain wallets and accepted as an optional input on `createWithAddress` and `createWithHash` (the API requires it for customers in Brazil). New `wallets.blockchain.setSelfCustody({ customer_id, id, is_self_custody })` records the answer once on an existing wallet. Adds the `blockchainWallet.update` webhook event.

- [#80](https://github.com/blindpaylabs/blindpay-node/pull/80) [`c8911d2`](https://github.com/blindpaylabs/blindpay-node/commit/c8911d26ce2e1e9b731e675bb175320d80e72074) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Add GBP support to the shared currency type and payout and payin FX inputs.

- [#77](https://github.com/blindpaylabs/blindpay-node/pull/77) [`eb5f370`](https://github.com/blindpaylabs/blindpay-node/commit/eb5f370e8bb6e10188d52acf67061dabf35311c7) Thanks [@anshitraj](https://github.com/anshitraj)! - Add EUR support to the shared currency type and payout and payin FX inputs.

## 5.3.1

See the [v5.3.1 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.3.1).

## 5.3.0

See the [v5.3.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.3.0).

## 5.2.0

See the [v5.2.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.2.0).

## 5.1.0

See the [v5.1.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.1.0).

## 5.0.1

See the [v5.0.1 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.0.1).

## 5.0.0

See the [v5.0.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.0.0).

## 4.1.1

See the [v4.1.1 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v4.1.1).

## 4.1.0

See the [v4.1.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v4.1.0).

## 4.0.2

### Patch Changes

- baa9ef3: Remove stale `signed_agreement_id` from `CreateVirtualAccountRequest`. The field was moved to an internal compliance flow and is not part of the public virtual account creation API.
