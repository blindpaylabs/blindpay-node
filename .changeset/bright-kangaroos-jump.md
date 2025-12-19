---
"@blindpay/node": major
---

## v3.0.0 - API Updates

This major release includes breaking changes to Virtual Accounts and new Solana payout support.

### Breaking Changes: Virtual Accounts API

**Updated Endpoints:**

- **List Virtual Accounts**: New `list(receiver_id)` method returns an array of virtual accounts
- **Get Virtual Account**: Changed from `get(receiver_id)` to `get({ receiver_id, id })` - now requires virtual account ID
- **Create Virtual Account**: Now requires `banking_partner` field (`"jpmorgan"` | `"citi"`)
- **Update Virtual Account**: Now requires `id` field in input and uses `/virtual-accounts/{id}` endpoint

**New Response Fields:**

Virtual account responses now include:
- `banking_partner`: `"jpmorgan"` | `"citi"`
- `kyc_status`: string (e.g., `"approved"`, `"verifying"`, `"rejected"`)
- `blockchain_wallet`: `{ network: Network, address: string } | null`

**Migration Guide:**

```typescript
// BEFORE (v2.x)
const { data } = await blindpay.virtualAccounts.get("re_123");

// AFTER (v3.x)
// List all virtual accounts for a receiver:
const { data: accounts } = await blindpay.virtualAccounts.list("re_123");

// Get a specific virtual account:
const { data: account } = await blindpay.virtualAccounts.get({ 
  receiver_id: "re_123", 
  id: "va_456" 
});

// Create now requires banking_partner:
await blindpay.virtualAccounts.create({
  receiver_id: "re_123",
  banking_partner: "jpmorgan", // NEW required field
  token: "USDC",
  blockchain_wallet_id: "bw_789"
});

// Update now requires id:
await blindpay.virtualAccounts.update({
  receiver_id: "re_123",
  id: "va_456", // NEW required field
  token: "USDC",
  blockchain_wallet_id: "bw_789"
});
```

### New Features: Solana Payout Endpoints

Added support for Solana blockchain payouts with two new methods:

- `payouts.authorizeSolana()` - Authorize a Solana transaction and get a serialized transaction
- `payouts.createSolana()` - Create a Solana payout with an optional signed transaction

**Authorize Solana Transaction:**
```typescript
const { data, error } = await blindpay.payouts.authorizeSolana({
  quote_id: "qu_000000000000",
  sender_wallet_address: "0x123...890"
});
// Returns: { serialized_transaction: "AAA...Zey8y0A" }
```

**Create Solana Payout:**
```typescript
const { data, error } = await blindpay.payouts.createSolana({
  quote_id: "qu_000000000000",
  sender_wallet_address: "0x123...890",
  signed_transaction: "AAA...Zey8y0A" // optional
});
// Returns payout with tracking information
```