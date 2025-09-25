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

## 🔑 Authentication

Get your API key from the Blindpay (https://app.blindpay.com/instances/{instanceId}/api-keys) and initialize the client:

```typescript
import { Blindpay } from '@blindpay/node';

const blindpay = new Blindpay('your-api-key-here');
```

## Quick Start

### Check for available rails

```typescript
async function getAvailableRails() {
    const blindpay = new Blindpay("your-api-key");
    
    const { data, error } = await blindpay.available.getRails();
    
    if (error) {
        throw new Error(error.message)
    }
    
    console.log('Rails: ', data)
 }

 getAvailableRails()
```

## Response Format

All API methods return a consistent response format:

```typescript
export type BlindpayApiResponse<T> = BlindpayErrorResponse | BlindpaySuccessResponse<T>

export type ErrorResponse = {
    message: string;
}

export type BlindpayErrorResponse = {
    data: null
    error: ErrorResponse;
}

export type BlindpaySuccessResponse<T> = {
    data: T;
    error: null;
}
```

### Success Response

```typescript
{
  data: /* your data */ ,
  error: null
}
```

### Error Response

```typescript
{
  data: null,
  error: {
    message: "Error message"
  }
}
```

## Error Handling

The SDK uses a consistent error handling pattern. Always check for errors:

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

## 🆘 Support

- 📧 Email: [gabriel@blindpay.com](mailto:gabriel@blindpay.com)
- 🐛 Issues: [GitHub Issues](https://github.com/blindpaylabs/node/issues)

## 🏷️ Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by the [Blindpay](https://blindpay.com) team