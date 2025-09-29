# Blindpay Node.js SDK

The official Node.js SDK for [Blindpay](https://blindpay.com) - Global payments infrastructure made simple.

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

To get started, you will need both your API key and your instance id, you can obtain your API key and instance id from the Blindpay dashboard [https://app.blindpay.com/instances/{instanceId}/api-keys](https://app.blindpay.com/instances/{instanceId}/api-keys)

```typescript
import { BlindPay } from '@blindpay/node';x

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
const { data, error } = await blindpay.payins.list({
    instanceId: "your-instance-id",
});

if (error) {
  // Handle error
  console.error('API Error:', error.message);
  return;
}

console.log('Success:', data); // fully typed
```

For detailed API documentation, visit:
- [Blindpay API documentation](https://blindpay.com/docs/getting-started/overview)
- [API Reference](https://api.blindpay.com/reference)

## Support

- 📧 Email: [gabriel@blindpay.com](mailto:gabriel@blindpay.com)
- 🐛 Issues: [GitHub Issues](https://github.com/blindpaylabs/blindpay-node/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by the [Blindpay](https://blindpay.com) team