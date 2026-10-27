# BlindPay Node.js SDK

The official Node.js SDK for [BlindPay](https://blindpay.com) - Stablecoin API for global payments.

## Installation

```bash
npm install @blindpay/node
# or
yarn add @blindpay/node
# or
pnpm add @blindpay/node
# or
bun add @blindpay/node
```

## Authentication

To get started, you will need both your API key and your instance id, you can obtain your API key and instance id from the BlindPay dashboard [https://app.blindpay.com/instances/{instanceId}/api-keys](https://app.blindpay.com/instances/{instanceId}/api-keys)

```typescript
import { BlindPay } from '@blindpay/node';

const blindpay = new BlindPay({
    apiKey: 'your-api-key-here',
    instanceId: 'your-instance-id-here'
  })
```

> [!NOTE]  
> All api calls are going to use the provided api key and instance id

## Quick Start

### Check for available rails

```typescript
async function getAvailableRails() {
    const blindpay = new BlindPay({
      apiKey: 'your-api-key-here',
      instanceId: 'your-instance-id-here'
    });

    const { data, error } = await blindpay.available.getRails();
    
    if (error) {
        throw new Error(error.message)
    }
    
    console.log('Rails: ', data)
 }

 getAvailableRails()
```

## Response format

All API methods return a consistent response format

### Success response

```typescript
{
  data: /* your data */ ,
  error: null
}
```

### Error response

```typescript
{
  data: null,
  error: {
    message: "Error message"
  }
}
```

## Error handling

This SDK uses a consistent error handling pattern. Always check for errors:

```typescript
const { data, error } = await blindpay.payins.list();

if (error) {
  // Handle error
  console.error('API Error:', error.message);
  return;
}

console.log('Success:', data); // fully typed
```

## Webhooks

`constructWebhookEvent` verifies the Svix signature and returns the payload typed by its `webhook_event`. It throws a `BlindPayError` when verification fails. Pass the raw request body, not a re-serialized object.

```typescript
const event = blindpay.constructWebhookEvent({
  secret: process.env.BLINDPAY_WEBHOOK_SECRET,
  headers: {
    id: req.headers['svix-id'],
    timestamp: req.headers['svix-timestamp'],
    signature: req.headers['svix-signature'],
  },
  payload: rawBody,
});

switch (event.webhook_event) {
  case 'tos.accept':
    console.log('ToS accepted:', event.tos_id);
    break;
  case 'customer.update':
    console.log('KYC status:', event.kyc_status);
    break;
}
```

`verifyWebhookSignature` is still available when you only need a boolean.

For detailed API documentation, visit:
- [BlindPay API documentation](https://blindpay.com/docs/getting-started/overview)
- [API Reference](https://api.blindpay.com/reference)

## Support

- 📧 Email: [alves@blindpay.com](mailto:alves@blindpay.com)
- 🐛 Issues: [GitHub Issues](https://github.com/blindpaylabs/blindpay-node/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by the [BlindPay](https://blindpay.com) team
