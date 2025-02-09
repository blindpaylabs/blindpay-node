# Blindpay SDK

A TypeScript SDK for interacting with the Blindpay API. This SDK provides a simple interface to manage instances, payouts, receivers, bank accounts, and more.

## Installation

```bash
npm install blindpay
```

## Quick Start

```typescript
import { Blindpay } from "blindpay";

// Initialize the SDK with your API key
const blindpay = new Blindpay("your-api-key");

// If you're working with a specific instance, you can provide the instance ID
const blindpayWithInstance = new Blindpay("your-api-key", "your-instance-id");
```

## Services

### API Keys

Manage API keys for your instances.

```typescript
// Create a new API key
const response = await blindpay.apiKeys.createApiKey({
  name: "My API Key",
  expires_at: "2025-12-31T23:59:59Z",
});

// List all API keys
const keys = await blindpay.apiKeys.getApiKeys();

// Get a specific API key
const key = await blindpay.apiKeys.getApiKey("ap_123456789012345");

// Delete an API key
await blindpay.apiKeys.deleteApiKey("ap_123456789012345");
```

### Available

Check available countries, currencies, and banking rails.

```typescript
// Get available countries
const countries = await blindpay.available.getAvailableCountries();

// Get available currencies for a country
const currencies = await blindpay.available.getAvailableCurrencies("US");

// Get bank details for a specific rail
const bankDetails = await blindpay.available.getBankDetails("wire");

// Get available rails
const rails = await blindpay.available.getAvailableRails();
```

### Bank Accounts

Manage bank accounts for receivers.

```typescript
// Create a bank account
const bankAccount = await blindpay.bankAccounts.createBankAccount(
  "rc_123456789012345",
  {
    account_number: "1234567890",
    routing_number: "021000021",
    account_type: "checking",
  }
);

// List bank accounts for a receiver
const accounts = await blindpay.bankAccounts.getBankAccounts(
  "rc_123456789012345"
);

// Get specific bank account
const account = await blindpay.bankAccounts.getBankAccount(
  "rc_123456789012345",
  "ba_123456789012345"
);

// Delete a bank account
await blindpay.bankAccounts.deleteBankAccount(
  "rc_123456789012345",
  "ba_123456789012345"
);
```

### Instance Management

Manage your instances and their members.

```typescript
// Update instance details
const updated = await blindpay.instances.updateInstance({
  name: "Updated Instance Name",
  webhook_url: "https://your-webhook.com/endpoint",
});

// Delete an instance
await blindpay.instances.deleteInstance();

// Get instance members
const members = await blindpay.instances.getInstanceMembers();
```

### Onboarding

Handle the onboarding process for new instances.

```typescript
// Update business details
await blindpay.onboardings.upsertBusinessDetails({
  legal_name: "Example Corp",
  tax_id: "123456789",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    postal_code: "94105",
    country: "US",
  },
});

// Get business profile
const profile = await blindpay.onboardings.getBusinessProfile();

// Start KYB process
await blindpay.onboardings.startKYB();

// Complete onboarding
await blindpay.onboardings.completeOnboarding();
```

### Payouts

Manage and track payouts.

```typescript
// Create a new EVM payout
const payout = await blindpay.payouts.createPayout({
  amount: "1000",
  currency: "USD",
  receiver_id: "rc_123456789012345",
  chain_id: 1,
  token_address: "0x...",
});

// Get all payouts
const payouts = await blindpay.payouts.retrievePayouts();

// Get specific payout
const payoutDetails = await blindpay.payouts.retrievePayout(
  "po_123456789012345"
);

// Track a payout
const tracking = await blindpay.payouts.retrievePayoutTrack(
  "po_123456789012345"
);
```

### Quotes

Get quotes and FX rates.

```typescript
// Create a quote
const quote = await blindpay.quotes.createQuote({
  source_currency: "USD",
  target_currency: "EUR",
  source_amount: "1000",
});

// Get FX rate
const rate = await blindpay.quotes.getFXRate({
  source_currency: "USD",
  target_currency: "EUR",
});
```

### Receivers

Manage payment receivers.

```typescript
// Create a new receiver
const receiver = await blindpay.receivers.createReceiver({
  name: "John Doe",
  email: "john@example.com",
  type: "individual",
});

// List all receivers
const receivers = await blindpay.receivers.getReceivers();

// Get specific receiver
const receiverDetails = await blindpay.receivers.getReceiver(
  "rc_123456789012345"
);

// Update a receiver
await blindpay.receivers.updateReceiver("rc_123456789012345", {
  name: "John Smith",
  email: "john.smith@example.com",
});

// Delete a receiver
await blindpay.receivers.deleteReceiver("rc_123456789012345");
```

## Error Handling

All API calls return a response object containing either `data` or `error`:

```typescript
const response = await blindpay.payouts.retrievePayout("po_123456789012345");

if (response.error) {
  console.error("Error:", response.error.message);
} else {
  console.log("Payout:", response.data);
}
```

## TypeScript Support

This SDK is written in TypeScript and includes type definitions for all API responses and request parameters.

## Development

### Building

```bash
npm run build
```

### Run development

```bash
npm run dev
```

## Support

For support, please contact support@blindpay.com or visit our documentation at https://docs.blindpay.com.
