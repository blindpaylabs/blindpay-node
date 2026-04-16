# BlindPay Node SDK - Agent Reference

## Commands

```
bun run build              # Build with tsup (CJS + ESM + DTS)
bun run test               # Run tests with vitest
bun run test:coverage      # Run tests with coverage
bun run check-types        # TypeScript type-check (no emit)
bun run lint:check         # Biome lint + format check
bun run lint:fix           # Biome auto-fix
```

## Project Structure

```
blindpay-node/
  package.json                          # @blindpay/node, bun package manager
  tsconfig.json                         # Strict TS, ES6 target, ESNext modules
  biome.json                            # Formatter + linter config
  vitest.config.mts                     # Test config (globals, fetch mock setup)
  vitest.setup.mts                      # Enables vitest-fetch-mock globally
  .changeset/config.json                # Changeset config (public access, main branch)
  types/index.d.ts                      # Shared types (BlindpayApiResponse, enums, pagination)
  src/
    index.ts                            # Re-exports all resources + client
    client.ts                           # BlindPay class (constructor, HTTP methods, resource wiring)
    internal/
      api-client.ts                     # InternalApiClient interface (get/post/put/patch/delete)
      blindpay-error.ts                 # BlindPayError class
      helpers/strict-omit.ts            # StrictOmit<T, K> utility type
      vitest-fetch-mock.d.ts            # Type declaration for fetch mock
    resources/
      {resource-name}/
        index.ts                        # Types + factory function for the resource
        {resource-name}.test.ts         # Tests (colocated with resource)
      wallets/                          # Grouped sub-resources (no index.ts)
        blockchain.ts                   # createBlockchainWalletsResource
        blockchain.test.ts
        custodial.ts                    # createCustodialWalletsResource
        custodial.test.ts
        offramp.ts                      # createOfframpWalletsResource
        offramp.test.ts
      payins/
        index.ts                        # createPayinsResource
        quotes.ts                       # createPayinQuotesResource (sub-resource)
        payins.test.ts
        payins-quotes.test.ts
```

## Conventions

### File naming

- Resource directories: kebab-case matching the API path segment (`partner-fees`, `api-keys`, `bank-accounts`).
- Single-file resources inside a directory: `index.ts`.
- Grouped resources without their own parent: individual files (`wallets/blockchain.ts`, `wallets/custodial.ts`).
- Sub-resource files: placed inside the parent resource directory (`payins/quotes.ts`).
- Tests: `{resource-name}.test.ts` colocated next to the resource file.

### Type naming

All types are defined in the same file as the factory function, above it. Naming pattern:

| Pattern | Example |
|---|---|
| Entity type | `Payin`, `Payout`, `CustodialWallet` |
| List input | `ListPayinsInput` |
| List response | `ListPayinsResponse` |
| Create input | `CreatePayinInput`, `CreatePartnerFeeInput` |
| Create response | `CreatePartnerFeeResponse` |
| Get input | `GetPayinInput` |
| Get response | `GetPayinResponse` |
| Update input | `UpdateReceiverInput` |
| Delete input | `DeleteReceiverInput` |
| String-only IDs | `export type GetPayinInput = string;` |
| Object inputs | `export type CreatePayoutInput = { ... };` |

Types use `snake_case` field names matching the API JSON exactly. Never camelCase.

### Factory function naming

```
create{PascalResourceName}Resource
```

Examples: `createPayinsResource`, `createPartnerFeesResource`, `createBlockchainWalletsResource`.

### Method naming

| HTTP operation | Method name |
|---|---|
| GET list | `list` |
| GET single | `get` |
| POST create | `create` |
| PUT update | `update` |
| DELETE | `delete` |
| Custom action | Descriptive camelCase: `getTrack`, `createEvm`, `submitDocuments`, `getLimits` |

### Import style

- Always use `import type` for type-only imports (enforced by biome `useImportType`).
- Shared types come from `../../../types` (the `types/index.d.ts` file).
- Internal API client: `import type { InternalApiClient } from "../../internal/api-client";`
- Path depth depends on file location. Resources at `src/resources/{name}/index.ts` use `../../internal/...` and `../../../types`.

### Code style

- Formatter: 4-space indent, double quotes, trailing commas (ES5), semicolons always, LF line endings, 100-char line width.
- Linter: Biome recommended rules. No unused variables (error). `import type` required (error). No explicit `any` (warn).
- TypeScript: `verbatimModuleSyntax: true` (must use `import type` for type-only imports). `strict: true`.

## How to: Add a New Resource

### Step 1: Create the resource file

Create `src/resources/{resource-name}/index.ts`.

Template for a standard instance-scoped resource:

```typescript
import type { BlindpayApiResponse, PaginationMetadata, PaginationParams } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

// -- Entity type --
export type Widget = {
    id: string;
    name: string;
    instance_id: string;
    created_at: string;
    updated_at: string;
};

// -- Input/Output types --
export type ListWidgetsInput = PaginationParams & {
    status?: string;
};

export type ListWidgetsResponse = {
    data: Widget[];
    pagination: PaginationMetadata;
};

export type CreateWidgetInput = {
    name: string;
    description?: string | null;
};

export type CreateWidgetResponse = {
    id: string;
};

export type GetWidgetInput = string;

export type GetWidgetResponse = Widget;

export type UpdateWidgetInput = {
    widget_id: string;
    name?: string;
};

export type DeleteWidgetInput = string;

// -- Factory function --
export function createWidgetsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListWidgetsInput): Promise<BlindpayApiResponse<ListWidgetsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/widgets${queryParams}`);
        },
        create({
            ...data
        }: CreateWidgetInput): Promise<BlindpayApiResponse<CreateWidgetResponse>> {
            return client.post(`/instances/${instanceId}/widgets`, data);
        },
        get(id: GetWidgetInput): Promise<BlindpayApiResponse<GetWidgetResponse>> {
            return client.get(`/instances/${instanceId}/widgets/${id}`);
        },
        update({ widget_id, ...data }: UpdateWidgetInput): Promise<BlindpayApiResponse<void>> {
            return client.put(`/instances/${instanceId}/widgets/${widget_id}`, data);
        },
        delete(id: DeleteWidgetInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/widgets/${id}`);
        },
    };
}
```

For a resource NOT scoped to an instance (like `available`), omit `instanceId` from the factory signature:

```typescript
export function createAvailableResource(client: InternalApiClient) {
    return {
        getRails(): Promise<BlindpayApiResponse<GetRailsResponse>> {
            return client.get("/available/rails");
        },
    };
}
```

### Step 2: Register in `src/client.ts`

1. Add the import at the top:
```typescript
import { createWidgetsResource } from "./resources/widgets";
```

2. Add the property declaration to the `BlindPay` class:
```typescript
readonly widgets: ReturnType<typeof createWidgetsResource>;
```

3. Initialize in the constructor body:
```typescript
this.widgets = createWidgetsResource(this.instanceId, this.api);
```

### Step 3: Re-export from `src/index.ts`

Add one line:
```typescript
export * from "./resources/widgets";
```

### Step 4: Create a test file

Create `src/resources/widgets/widgets.test.ts`:

```typescript
import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { GetWidgetResponse, ListWidgetsResponse } from ".";

describe("Widgets", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("List widgets", () => {
        it("should list widgets", async () => {
            const mockedWidgets: ListWidgetsResponse = {
                data: [
                    {
                        id: "wi_000000000000",
                        name: "Test Widget",
                        instance_id: "in_000000000000",
                        created_at: "2025-01-01T00:00:00Z",
                        updated_at: "2025-01-01T00:00:00Z",
                    },
                ],
                pagination: {
                    has_more: false,
                    next_page: "",
                    prev_page: "",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWidgets), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.widgets.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedWidgets);
        });
    });

    describe("Get widget", () => {
        it("should get a widget", async () => {
            const mockedWidget: GetWidgetResponse = {
                id: "wi_000000000000",
                name: "Test Widget",
                instance_id: "in_000000000000",
                created_at: "2025-01-01T00:00:00Z",
                updated_at: "2025-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWidget), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.widgets.get("wi_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedWidget);
        });
    });
});
```

### Step 5: Create a changeset

```bash
bunx changeset
```

Select `@blindpay/node`, choose `minor` for new features, and write a summary.

Alternatively, create a file `.changeset/{random-name}.md` manually:

```markdown
---
"@blindpay/node": minor
---

Added widgets resource with list, create, get, update, and delete methods.
```

## How to: Add a Method to an Existing Resource

### Step 1: Add types to the resource file

Add the input and response types above the factory function in the resource's `index.ts`:

```typescript
export type ActivateWidgetInput = string;

export type ActivateWidgetResponse = {
    id: string;
    status: string;
};
```

### Step 2: Add the method inside the factory function's return object

```typescript
export function createWidgetsResource(instanceId: string, client: InternalApiClient) {
    return {
        // ... existing methods ...
        activate(
            id: ActivateWidgetInput
        ): Promise<BlindpayApiResponse<ActivateWidgetResponse>> {
            return client.post(`/instances/${instanceId}/widgets/${id}/activate`, {});
        },
    };
}
```

### Step 3: Add tests and a changeset

Follow the same test pattern. Add a `patch` changeset.

## How to: Modify Types

### Add a field to an existing type

Add the field directly to the type definition. Use `snake_case`. Match the API response exactly.

```typescript
export type Widget = {
    id: string;
    name: string;
    description: string | null;  // <-- new field
    instance_id: string;
    created_at: string;
    updated_at: string;
};
```

If the field is optional in the API response, use `?`:
```typescript
    metadata?: Record<string, string> | null;
```

### Remove a field

Delete the field from the type definition. Search the codebase for any usage of that field.

### Rename a field

Change the field name in the type definition. This is a breaking change -- use a `major` changeset.

### Shared types

Types like `Currency`, `Network`, `StablecoinToken`, `TransactionStatus`, `PaginationParams`, `PaginationMetadata`, `BlindpayApiResponse`, and `Country` live in `types/index.d.ts`. If a new enum value needs to be added to a shared type (e.g., a new network), edit it there.

## How to: Remove a Resource

1. Delete the resource directory: `src/resources/{resource-name}/`.
2. Remove the import from `src/client.ts`.
3. Remove the property declaration from the `BlindPay` class.
4. Remove the initialization line from the constructor.
5. Remove the re-export line from `src/index.ts`.
6. Create a `major` changeset (breaking change).

## How to: Add a Sub-Resource

A sub-resource is nested under a parent on the client (e.g., `blindpay.payins.quotes`, `blindpay.instances.apiKeys`).

### Step 1: Create the sub-resource file

Place it inside the parent resource directory. For a sub-resource of `payins`:

File: `src/resources/payins/quotes.ts`

```typescript
import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type CreatePayinQuoteInput = {
    blockchain_wallet_id: string;
    // ...
};

export type CreatePayinQuoteResponse = {
    id: string;
    // ...
};

export function createPayinQuotesResource(instanceId: string, client: InternalApiClient) {
    return {
        create({
            ...data
        }: CreatePayinQuoteInput): Promise<BlindpayApiResponse<CreatePayinQuoteResponse>> {
            return client.post(`/instances/${instanceId}/payin-quotes`, data);
        },
    };
}
```

### Step 2: Register in `src/client.ts`

1. Import:
```typescript
import { createPayinQuotesResource } from "./resources/payins/quotes";
```

2. Declare the type with intersection:
```typescript
readonly payins: ReturnType<typeof createPayinsResource> & {
    quotes: ReturnType<typeof createPayinQuotesResource>;
};
```

3. Initialize with spread:
```typescript
this.payins = {
    ...createPayinsResource(this.instanceId, this.api),
    quotes: createPayinQuotesResource(this.instanceId, this.api),
};
```

### Step 3: Re-export from `src/index.ts`

```typescript
export * from "./resources/payins/quotes";
```

### Grouped resources (no parent entity)

For groupings like `wallets` where there is no parent `createWalletsResource`, each sub-resource is its own file and the parent is a plain object:

```typescript
// Declaration
readonly wallets: {
    blockchain: ReturnType<typeof createBlockchainWalletsResource>;
    offramp: ReturnType<typeof createOfframpWalletsResource>;
    custodial: ReturnType<typeof createCustodialWalletsResource>;
};

// Initialization
this.wallets = {
    blockchain: createBlockchainWalletsResource(this.instanceId, this.api),
    offramp: createOfframpWalletsResource(this.instanceId, this.api),
    custodial: createCustodialWalletsResource(this.instanceId, this.api),
};
```

## Testing

### Framework

Vitest with `vitest-fetch-mock`. The `fetchMock` global is available in all test files (configured in `vitest.setup.mts`). Vitest globals (`describe`, `it`, `expect`, `afterEach`) are enabled.

### Test file location

Colocated with the resource file:
- `src/resources/payins/payins.test.ts` for `src/resources/payins/index.ts`
- `src/resources/wallets/blockchain.test.ts` for `src/resources/wallets/blockchain.ts`

### Test pattern

```typescript
import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { ListWidgetsResponse } from ".";

describe("Widgets", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("List widgets", () => {
        it("should list widgets", async () => {
            const mockedResponse: ListWidgetsResponse = { /* ... */ };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.widgets.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });
});
```

Key rules:
- Always call `fetchMock.resetMocks()` in `afterEach`.
- Instantiate `BlindPay` with `apiKey: "test-key"` and `instanceId: "in_000000000000"`.
- Use `fetchMock.mockResponseOnce` with `JSON.stringify` and content-type header.
- Destructure `{ data, error }` from the result.
- Assert `error` is null and `data` matches the mock.

### Running

```bash
bun run test                 # All tests
bun run test:coverage        # With coverage (excludes src/internal/** and src/index.ts)
```

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets).

### Semantic versioning rules

- `patch`: Bug fixes, type corrections, adding optional fields to existing types.
- `minor`: New resources, new methods on existing resources, new sub-resources.
- `major`: Removing resources/methods, renaming fields, removing fields, changing required/optional status of input fields.

### Creating a changeset

```bash
bunx changeset
```

Or manually create `.changeset/{name}.md`:

```markdown
---
"@blindpay/node": minor
---

Added widgets resource with CRUD methods.
```

The changeset file name should be a random short identifier (changesets CLI generates these automatically).

### Configuration

- `baseBranch`: `main`
- `access`: `public` (npm)
- `commit`: `false` (changesets do not auto-commit)

## OpenAPI to SDK Mapping Rules

This section defines exactly how an OpenAPI specification maps to SDK code.

### Path to resource mapping

| API path pattern | Resource location | Factory function |
|---|---|---|
| `/instances/{id}/widgets` | `src/resources/widgets/index.ts` | `createWidgetsResource` |
| `/instances/{id}/widgets/{widgetId}` | Same file as above | Same factory, different method |
| `/instances/{id}/widgets/{widgetId}/actions` | Same file if simple | Method in same factory |
| `/available/something` | `src/resources/available/index.ts` | `createAvailableResource` (no instanceId) |
| `/instances/{id}/parent/{parentId}/children` | `src/resources/children/index.ts` OR `src/resources/parent/children.ts` | `createChildrenResource` |
| `/e/widgets/{id}` | Same widget resource file | Method like `getTrack` (public/external endpoints) |

### HTTP method to SDK method mapping

| HTTP method | Path pattern | SDK method name | Notes |
|---|---|---|---|
| `GET` | `/instances/{id}/widgets` | `list` | Returns paginated response |
| `GET` | `/instances/{id}/widgets/{widgetId}` | `get` | Input is a string ID |
| `POST` | `/instances/{id}/widgets` | `create` | Input is an object |
| `PUT` | `/instances/{id}/widgets/{widgetId}` | `update` | Input destructures ID from body |
| `PATCH` | `/instances/{id}/widgets/{widgetId}` | `update` | Same pattern as PUT |
| `DELETE` | `/instances/{id}/widgets/{widgetId}` | `delete` | Input is a string ID |
| `POST` | `/instances/{id}/widgets/{widgetId}/action-name` | `actionName` | camelCase the action |
| `GET` | `/instances/{id}/widgets/{widgetId}/sub-thing` | `getSubThing` | camelCase with get prefix |

### Request body to input type mapping

OpenAPI request body schema fields map 1:1 to TypeScript type fields using `snake_case`:

```yaml
# OpenAPI
requestBody:
  content:
    application/json:
      schema:
        type: object
        required: [name, currency]
        properties:
          name:
            type: string
          currency:
            type: string
            enum: [USD, BRL, MXN]
          description:
            type: string
            nullable: true
```

Maps to:

```typescript
export type CreateWidgetInput = {
    name: string;
    currency: "USD" | "BRL" | "MXN";
    description?: string | null;
};
```

Rules:
- Required fields: no `?`, no `| null` (unless the API explicitly allows null).
- Optional fields: use `?` and `| null` if nullable.
- String enums: use union literal types.
- Numbers: use `number`.
- Booleans: use `boolean`.
- Arrays: use `Array<T>` or `T[]`.
- Nested objects: inline or define a separate type.
- Date strings: use `string`.

### Response schema to output type mapping

Response schemas map the same way. Every field from the API response becomes a type field:

```yaml
# OpenAPI
responses:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            id:
              type: string
            status:
              type: string
              enum: [processing, completed, failed]
            created_at:
              type: string
              format: date-time
```

Maps to:

```typescript
export type GetWidgetResponse = {
    id: string;
    status: "processing" | "completed" | "failed";
    created_at: string;
};
```

### Query parameters to input type mapping

Query parameters are merged into the input type using intersection with `PaginationParams`:

```yaml
# OpenAPI
parameters:
  - name: status
    in: query
    schema:
      type: string
  - name: limit
    in: query
    schema:
      type: string
  - name: offset
    in: query
    schema:
      type: string
```

Maps to:

```typescript
export type ListWidgetsInput = PaginationParams & {
    status?: string;
};
```

The method builds query params with `URLSearchParams`:

```typescript
list(params?: ListWidgetsInput): Promise<BlindpayApiResponse<ListWidgetsResponse>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : "";
    return client.get(`/instances/${instanceId}/widgets${queryParams}`);
},
```

### Path parameters

Path parameters that are resource IDs are handled in two ways:

1. **Single ID (the resource's own ID)**: passed as a plain string argument.
```typescript
get(id: GetWidgetInput): Promise<BlindpayApiResponse<GetWidgetResponse>> {
    return client.get(`/instances/${instanceId}/widgets/${id}`);
},
```

2. **Multiple IDs or ID + body**: destructured from an object input type.
```typescript
export type UpdateWidgetInput = {
    widget_id: string;
    name?: string;
};

update({ widget_id, ...data }: UpdateWidgetInput): Promise<BlindpayApiResponse<void>> {
    return client.put(`/instances/${instanceId}/widgets/${widget_id}`, data);
},
```

3. **Nested resource IDs**: all IDs come from the input object.
```typescript
export type GetOfframpWalletInput = {
    receiver_id: string;
    bank_account_id: string;
    id: string;
};

get({
    receiver_id,
    bank_account_id,
    id,
}: GetOfframpWalletInput): Promise<BlindpayApiResponse<GetOfframpWalletResponse>> {
    return client.get(
        `/instances/${instanceId}/receivers/${receiver_id}/bank-accounts/${bank_account_id}/offramp-wallets/${id}`
    );
},
```

### Return type

Every method returns `Promise<BlindpayApiResponse<T>>` where `T` is the response type. `BlindpayApiResponse<T>` is a discriminated union:

```typescript
type BlindpayApiResponse<T> = { data: T; error: null } | { data: null; error: { message: string } }
```

For methods with no response body, use `Promise<BlindpayApiResponse<void>>`.

### Discriminated/variant creation

When one endpoint creates different variants based on a `type` field, create separate methods that hardcode the discriminator:

```typescript
createIndividualWithStandardKYC(
    data: CreateIndividualWithStandardKYCInput
): Promise<BlindpayApiResponse<CreateIndividualWithStandardKYCResponse>> {
    return client.post(`/instances/${instanceId}/receivers`, {
        kyc_type: "standard",
        type: "individual",
        ...data,
    });
},
```

### Object body destructuring pattern

When passing an object body to `client.post`/`client.put`, use rest destructuring even when no fields need extracting:

```typescript
create({
    ...data
}: CreateWidgetInput): Promise<BlindpayApiResponse<CreateWidgetResponse>> {
    return client.post(`/instances/${instanceId}/widgets`, data);
},
```

This is the consistent pattern used throughout the codebase.

### Summary: complete checklist for adding an OpenAPI endpoint

1. Identify the API path and HTTP method.
2. Determine which resource file it belongs to (or create a new one).
3. Define the input type from request body schema + path params.
4. Define the response type from the response schema.
5. Add the method to the factory function's return object.
6. If new resource: register in `client.ts`, re-export from `index.ts`.
7. Add tests.
8. Add a changeset.
9. Run `bun run check-types && bun run lint:check && bun run test`.
