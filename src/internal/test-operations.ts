import type { BlindpayApiResponse } from "../../types";
import type { BlindPay } from "../client";

/**
 * Test-only table: every SDK operation of the public spec (`"METHOD /v1/path"`, as keyed in
 * test/fixtures/spec/index.json) with the client method that implements it. Several methods can
 * implement one operation (bank-account creates per rail, customer creates per KYC tier,
 * blockchain-wallet creates). Drives the op-coverage round-trip test and the fixture type test.
 *
 * Inputs are passed `as never`: these tests check routing and response decoding, and every
 * resource's own tests cover its request bodies. Path ids are real values, so the URL is too.
 */
export type OperationCase = {
    operation: string;
    /** Dotted accessor on the client, e.g. `customers.bankAccounts.get`. */
    method: string;
    call: (blindpay: BlindPay) => Promise<BlindpayApiResponse<unknown>>;
};

const CUSTOMER = "re_000000000000";
const BANK_ACCOUNT = "ba_000000000000";
const ID = "id_000000000000";
const ANY = {} as never;

const nested = { customer_id: CUSTOMER, id: ID } as never;
const withCustomer = { customer_id: CUSTOMER } as never;

const BANK_ACCOUNTS = "POST /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts";
const RAIL_CREATES = [
    "createPix",
    "createPixSafe",
    "createArgentinaTransfers",
    "createSpei",
    "createColombiaAch",
    "createAch",
    "createWire",
    "createInternationalSwift",
    "createRtp",
    "createTed",
    "createSepa",
    "createFasterPayments",
] as const;

/** The `type` each rail's create response carries (bank-account fixtures are rail-agnostic). */
export const RAIL_TYPES: Record<(typeof RAIL_CREATES)[number], string> = {
    createPix: "pix",
    createPixSafe: "pix_safe",
    createArgentinaTransfers: "transfers_bitso",
    createSpei: "spei_bitso",
    createColombiaAch: "ach_cop_bitso",
    createAch: "ach",
    createWire: "wire",
    createInternationalSwift: "international_swift",
    createRtp: "rtp",
    createTed: "ted",
    createSepa: "sepa",
    createFasterPayments: "faster_payments",
};

function op(operation: string, method: string, call: OperationCase["call"]): OperationCase {
    return { operation, method, call };
}

export const OPERATIONS: OperationCase[] = [
    // available
    op("GET /v1/available/bank-details", "available.getBankDetails", (b) =>
        b.available.getBankDetails("pix")
    ),
    op("GET /v1/available/naics", "available.getNaicsCodes", (b) => b.available.getNaicsCodes()),
    op("GET /v1/available/rails", "available.getRails", (b) => b.available.getRails()),
    op("GET /v1/available/swift/{swift}", "available.getSwiftCodeBankDetails", (b) =>
        b.available.getSwiftCodeBankDetails("BOFAUS3N")
    ),

    // bank accounts
    ...RAIL_CREATES.map((name) =>
        op(BANK_ACCOUNTS, `customers.bankAccounts.${name}`, (b) =>
            b.customers.bankAccounts[name](withCustomer)
        )
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts",
        "customers.bankAccounts.list",
        (b) => b.customers.bankAccounts.list(withCustomer)
    ),
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/plaid",
        "customers.bankAccounts.createPlaid",
        (b) => b.customers.bankAccounts.createPlaid(withCustomer)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{id}",
        "customers.bankAccounts.get",
        (b) => b.customers.bankAccounts.get(nested)
    ),
    op(
        "DELETE /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{id}",
        "customers.bankAccounts.delete",
        (b) => b.customers.bankAccounts.delete(nested)
    ),

    // blockchain wallets
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets",
        "wallets.blockchain.createWithAddress",
        (b) => b.wallets.blockchain.createWithAddress(withCustomer)
    ),
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets",
        "wallets.blockchain.createWithHash",
        (b) => b.wallets.blockchain.createWithHash(withCustomer)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets",
        "wallets.blockchain.list",
        (b) => b.wallets.blockchain.list(CUSTOMER)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/sign-message",
        "wallets.blockchain.getWalletMessage",
        (b) => b.wallets.blockchain.getWalletMessage(CUSTOMER)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/{id}",
        "wallets.blockchain.get",
        (b) => b.wallets.blockchain.get(nested)
    ),
    op(
        "DELETE /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/{id}",
        "wallets.blockchain.delete",
        (b) => b.wallets.blockchain.delete(nested)
    ),
    op(
        "PATCH /v1/instances/{instance_id}/customers/{customer_id}/blockchain-wallets/{id}",
        "wallets.blockchain.setSelfCustody",
        (b) => b.wallets.blockchain.setSelfCustody(nested)
    ),
    op(
        "POST /v1/instances/{instance_id}/mint-usdb-solana",
        "wallets.blockchain.mintUsdbSolana",
        (b) => b.wallets.blockchain.mintUsdbSolana(ANY)
    ),
    op(
        "POST /v1/instances/{instance_id}/prepare-delegate-solana",
        "wallets.blockchain.prepareSolanaDelegationTransaction",
        (b) => b.wallets.blockchain.prepareSolanaDelegationTransaction(ANY)
    ),
    op(
        "POST /v1/instances/{instance_id}/create-asset-trustline",
        "wallets.blockchain.createAssetTrustline",
        (b) => b.wallets.blockchain.createAssetTrustline("GABC")
    ),
    op(
        "POST /v1/instances/{instance_id}/mint-usdb-stellar",
        "wallets.blockchain.mintUsdbStellar",
        (b) => b.wallets.blockchain.mintUsdbStellar(ANY)
    ),

    // customers
    op(
        "POST /v1/instances/{instance_id}/customers",
        "customers.createIndividualWithStandardKYC",
        (b) => b.customers.createIndividualWithStandardKYC(ANY)
    ),
    op(
        "POST /v1/instances/{instance_id}/customers",
        "customers.createIndividualWithEnhancedKYC",
        (b) => b.customers.createIndividualWithEnhancedKYC(ANY)
    ),
    op(
        "POST /v1/instances/{instance_id}/customers",
        "customers.createBusinessWithStandardKYB",
        (b) => b.customers.createBusinessWithStandardKYB(ANY)
    ),
    op("GET /v1/instances/{instance_id}/customers", "customers.list", (b) =>
        b.customers.list({ limit: "10" })
    ),
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/limit-increase",
        "customers.requestLimitIncrease",
        (b) => b.customers.requestLimitIncrease(withCustomer)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/limit-increase",
        "customers.getLimitIncreaseRequests",
        (b) => b.customers.getLimitIncreaseRequests(CUSTOMER)
    ),
    op("GET /v1/instances/{instance_id}/customers/{customer_id}/rfi", "customers.rfi.get", (b) =>
        b.customers.rfi.get(CUSTOMER)
    ),
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/rfi",
        "customers.rfi.submit",
        (b) => b.customers.rfi.submit({ customer_id: CUSTOMER, response: {} })
    ),
    op("GET /v1/instances/{instance_id}/customers/{id}", "customers.get", (b) =>
        b.customers.get(CUSTOMER)
    ),
    op("PUT /v1/instances/{instance_id}/customers/{id}", "customers.update", (b) =>
        b.customers.update(withCustomer)
    ),
    op("DELETE /v1/instances/{instance_id}/customers/{id}", "customers.delete", (b) =>
        b.customers.delete(CUSTOMER)
    ),
    op("GET /v1/instances/{instance_id}/limits/customers/{id}", "customers.getLimits", (b) =>
        b.customers.getLimits(CUSTOMER)
    ),

    // fees
    op("GET /v1/instances/{instance_id}/billing/fees", "fees.get", (b) => b.fees.get()),

    // instances
    op("GET /v1/instances/{id}", "instances.get", (b) => b.instances.get()),
    op("PUT /v1/instances/{id}", "instances.update", (b) => b.instances.update(ANY)),
    op("DELETE /v1/instances/{id}", "instances.delete", (b) => b.instances.delete()),
    op("GET /v1/instances/{id}/members", "instances.getMembers", (b) => b.instances.getMembers()),
    op("DELETE /v1/instances/{id}/members/{user_id}", "instances.deleteMember", (b) =>
        b.instances.deleteMember("us_000000000000")
    ),
    op("PUT /v1/instances/{id}/members/{user_id}", "instances.updateMemberRole", (b) =>
        b.instances.updateMemberRole({ memberId: "us_000000000000", role: "admin" })
    ),
    op("POST /v1/instances/{id}/ownership", "instances.migrateOwnership", (b) =>
        b.instances.migrateOwnership(ANY)
    ),
    op(
        "GET /v1/instances/{instance_id}/onboarding/business_details",
        "instances.onboarding.getBusinessDetails",
        (b) => b.instances.onboarding.getBusinessDetails()
    ),
    op(
        "GET /v1/instances/{instance_id}/onboarding/business_profile",
        "instances.onboarding.getBusinessProfile",
        (b) => b.instances.onboarding.getBusinessProfile()
    ),
    op(
        "GET /v1/instances/{instance_id}/onboarding/ownership_documents",
        "instances.onboarding.getOwnershipDocuments",
        (b) => b.instances.onboarding.getOwnershipDocuments()
    ),
    op("GET /v1/instances/{instance_id}/rfi", "instances.rfi.get", (b) => b.instances.rfi.get()),
    op("POST /v1/instances/{instance_id}/rfi", "instances.rfi.submit", (b) =>
        b.instances.rfi.submit({ response: {} })
    ),
    op("POST /v1/e/instances/{instance_id}/tos", "instances.tos.initiate", (b) =>
        b.instances.tos.initiate(ANY)
    ),
    op(
        "POST /v1/instances/{instance_id}/webhook-endpoints",
        "instances.webhookEndpoints.create",
        (b) => b.instances.webhookEndpoints.create(ANY)
    ),
    op(
        "GET /v1/instances/{instance_id}/webhook-endpoints",
        "instances.webhookEndpoints.list",
        (b) => b.instances.webhookEndpoints.list()
    ),
    op(
        "GET /v1/instances/{instance_id}/webhook-endpoints/portal-access",
        "instances.webhookEndpoints.getPortalAccessUrl",
        (b) => b.instances.webhookEndpoints.getPortalAccessUrl()
    ),
    op(
        "DELETE /v1/instances/{instance_id}/webhook-endpoints/{id}",
        "instances.webhookEndpoints.delete",
        (b) => b.instances.webhookEndpoints.delete(ID)
    ),
    op(
        "GET /v1/instances/{instance_id}/webhook-endpoints/{id}/secret",
        "instances.webhookEndpoints.getSecret",
        (b) => b.instances.webhookEndpoints.getSecret(ID)
    ),

    // offramp wallets
    ...(
        [
            ["POST", "", "create"],
            ["GET", "", "list"],
            ["GET", "/{id}", "get"],
            ["PUT", "/{id}", "update"],
        ] as const
    ).map(([verb, suffix, name]) =>
        op(
            `${verb} /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/{bank_account_id}/offramp-wallets${suffix}`,
            `wallets.offramp.${name}`,
            (b) =>
                b.wallets.offramp[name]({
                    customer_id: CUSTOMER,
                    bank_account_id: BANK_ACCOUNT,
                    id: ID,
                } as never)
        )
    ),

    // partner fees
    op("POST /v1/instances/{instance_id}/partner-fees", "partnerFees.create", (b) =>
        b.partnerFees.create(ANY)
    ),
    op("GET /v1/instances/{instance_id}/partner-fees", "partnerFees.list", (b) =>
        b.partnerFees.list()
    ),
    op("GET /v1/instances/{instance_id}/partner-fees/{id}", "partnerFees.get", (b) =>
        b.partnerFees.get(ID)
    ),
    op("DELETE /v1/instances/{instance_id}/partner-fees/{id}", "partnerFees.delete", (b) =>
        b.partnerFees.delete(ID)
    ),

    // payables
    op("POST /v1/instances/{instance_id}/payables", "payables.create", (b) =>
        b.payables.create(ANY)
    ),
    op("GET /v1/instances/{instance_id}/payables", "payables.list", (b) =>
        b.payables.list({ limit: "10" })
    ),
    op("GET /v1/instances/{instance_id}/payables/{id}", "payables.get", (b) => b.payables.get(ID)),
    op("DELETE /v1/instances/{instance_id}/payables/{id}", "payables.delete", (b) =>
        b.payables.delete(ID)
    ),

    // payins
    op("POST /v1/instances/{instance_id}/payin-quotes", "payins.quotes.create", (b) =>
        b.payins.quotes.create(ANY)
    ),
    op("POST /v1/instances/{instance_id}/payin-quotes/fx", "payins.quotes.getFxRate", (b) =>
        b.payins.quotes.getFxRate(ANY)
    ),
    op("GET /v1/e/payins/{id}", "payins.getTrack", (b) => b.payins.getTrack(ID)),
    op("GET /v1/instances/{instance_id}/payins", "payins.list", (b) =>
        b.payins.list({ limit: "10" })
    ),
    op("POST /v1/instances/{instance_id}/payins/evm", "payins.createEvm", (b) =>
        b.payins.createEvm("pq_000000000000")
    ),
    op("GET /v1/instances/{instance_id}/payins/{id}", "payins.get", (b) => b.payins.get(ID)),

    // payouts
    op("GET /v1/e/payouts/{id}", "payouts.getTrack", (b) => b.payouts.getTrack(ID)),
    op("GET /v1/instances/{instance_id}/payouts", "payouts.list", (b) =>
        b.payouts.list({ limit: "10" })
    ),
    op("POST /v1/instances/{instance_id}/payouts/evm", "payouts.createEvm", (b) =>
        b.payouts.createEvm(ANY)
    ),
    op("POST /v1/instances/{instance_id}/payouts/solana", "payouts.createSolana", (b) =>
        b.payouts.createSolana(ANY)
    ),
    op("POST /v1/instances/{instance_id}/payouts/stellar", "payouts.createStellar", (b) =>
        b.payouts.createStellar(ANY)
    ),
    op(
        "POST /v1/instances/{instance_id}/payouts/stellar/authorize",
        "payouts.authorizeStellarToken",
        (b) => b.payouts.authorizeStellarToken(ANY)
    ),
    op("GET /v1/instances/{instance_id}/payouts/{id}", "payouts.get", (b) => b.payouts.get(ID)),
    op("POST /v1/instances/{instance_id}/payouts/{id}/documents", "payouts.submitDocuments", (b) =>
        b.payouts.submitDocuments({ payout_id: ID } as never)
    ),

    // quotes
    op("POST /v1/instances/{instance_id}/quotes", "quotes.create", (b) => b.quotes.create(ANY)),
    op("POST /v1/instances/{instance_id}/quotes/fx", "quotes.getFxRate", (b) =>
        b.quotes.getFxRate(ANY)
    ),

    // transfers
    op("POST /v1/instances/{instance_id}/transfer-quotes", "transfers.quotes.create", (b) =>
        b.transfers.quotes.create(ANY)
    ),
    op("GET /v1/e/transfers/{id}", "transfers.getTrack", (b) => b.transfers.getTrack(ID)),
    op("GET /v1/instances/{instance_id}/transfers", "transfers.list", (b) =>
        b.transfers.list({ limit: "10" })
    ),
    op("POST /v1/instances/{instance_id}/transfers", "transfers.create", (b) =>
        b.transfers.create(ANY)
    ),
    op("GET /v1/instances/{instance_id}/transfers/{id}", "transfers.get", (b) =>
        b.transfers.get(ID)
    ),

    // upload
    op("POST /v1/presign", "upload.presign", (b) =>
        b.upload.presign({ file_url: "https://example.com/f.pdf" })
    ),
    op("POST /v1/upload", "upload.upload", (b) =>
        b.upload.upload({ file: new Blob(["%PDF"]), bucket: "documents" })
    ),
    op("POST /v1/upload/analyze", "upload.analyze", (b) =>
        b.upload.analyze({ file: new Blob(["%PDF"]), type: "invoice" })
    ),

    // virtual accounts
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts",
        "virtualAccounts.create",
        (b) => b.virtualAccounts.create(withCustomer)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts",
        "virtualAccounts.list",
        (b) => b.virtualAccounts.list(CUSTOMER)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts/{id}",
        "virtualAccounts.get",
        (b) => b.virtualAccounts.get(nested)
    ),
    op(
        "PUT /v1/instances/{instance_id}/customers/{customer_id}/virtual-accounts/{id}",
        "virtualAccounts.update",
        (b) => b.virtualAccounts.update(nested)
    ),

    // custodial wallets
    op(
        "POST /v1/instances/{instance_id}/customers/{customer_id}/wallets",
        "wallets.custodial.create",
        (b) => b.wallets.custodial.create(withCustomer)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/wallets",
        "wallets.custodial.list",
        (b) => b.wallets.custodial.list(CUSTOMER)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}",
        "wallets.custodial.get",
        (b) => b.wallets.custodial.get(nested)
    ),
    op(
        "DELETE /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}",
        "wallets.custodial.delete",
        (b) => b.wallets.custodial.delete(nested)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}/balance",
        "wallets.custodial.getBalance",
        (b) => b.wallets.custodial.getBalance(nested)
    ),
    op(
        "GET /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}/deposits",
        "wallets.custodial.getDeposits",
        (b) =>
            b.wallets.custodial.getDeposits({
                customer_id: CUSTOMER,
                id: ID,
                limit: "10",
            })
    ),
];
