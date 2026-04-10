import { BlindPay } from "./src/client";
import type {
    AccountPurpose,
    BusinessIndustry,
    BusinessType,
    CreateBusinessWithStandardKYBInput,
    CreateIndividualWithEnhancedKYCInput,
    CreateIndividualWithStandardKYCInput,
    EstimatedAnnualRevenue,
    SourceOfWealth,
} from "./src/resources/receivers";

// Initialize the client
const blindpay = new BlindPay({
    apiKey: process.env.BLINDPAY_API_KEY || "KR2nvfiwUVHY2YMNZb26GC",
    instanceId: process.env.BLINDPAY_INSTANCE_ID || "in_diWQinhA2X7v",
});

async function testCreateIndividualWithStandardKYC() {
    console.log("\n=== Testing createIndividualWithStandardKYC ===");

    // BUG IN PR: SDK types say only country/email required, but API requires ALL these fields!
    const minimalInput: CreateIndividualWithStandardKYCInput = {
        country: "US",
        email: "test@example.com",
        state_province_region: "NY",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1990-01-15",
        tax_id: "123456789",
        address_line_1: "123 Main St",
        city: "New York",
        postal_code: "10001",
        id_doc_country: "US",
        id_doc_type: "PASSPORT",
        id_doc_front_file: "https://example.com/id-front.jpg",
        selfie_file: "https://example.com/selfie.jpg", // Also required by API!
    };

    // console.log("Minimal input (only required fields):", minimalInput);

    // Test with new optional fields
    const _fullInput: CreateIndividualWithStandardKYCInput = {
        country: "US",
        email: "full-test@example.com",
        // New fields added in this PR:
        account_purpose: "personal_or_living_expenses" satisfies AccountPurpose,
        selfie_file: "https://example.com/selfie.jpg",
        source_of_wealth: "investments" satisfies SourceOfWealth,
        // Existing fields now optional:
        first_name: "John",
        last_name: "Doe",
        address_line_1: "123 Main St",
    };

    // console.log("Full input with new optional fields:", fullInput);

    console.log("Sending body:", JSON.stringify(minimalInput, null, 2));
    const { data, error } = await blindpay.receivers.createIndividualWithStandardKYC(minimalInput);
    console.log("Response:", { data, error });
}

async function _testCreateIndividualWithEnhancedKYC() {
    console.log("\n=== Testing createIndividualWithEnhancedKYC ===");

    // Test with only required fields - THIS IS NEW!
    const minimalInput: CreateIndividualWithEnhancedKYCInput = {
        country: "BR",
        email: "enhanced@example.com",
    };

    console.log("Minimal input (only required fields):", minimalInput);

    // Test with new optional fields
    const enhancedInput: CreateIndividualWithEnhancedKYCInput = {
        country: "BR",
        email: "enhanced-full@example.com",
        // New fields:
        account_purpose: "receive_payments_for_goods_and_services" satisfies AccountPurpose,
        source_of_wealth: "business_dividends_or_profits" satisfies SourceOfWealth,
    };

    console.log("Enhanced input with new fields:", enhancedInput);
}

async function _testCreateBusinessWithStandardKYB() {
    console.log("\n=== Testing createBusinessWithStandardKYB ===");

    // Test with only required fields - THIS IS NEW!
    const minimalInput: CreateBusinessWithStandardKYBInput = {
        country: "US",
        email: "business@example.com",
    };

    console.log("Minimal input (only required fields):", minimalInput);

    // Test with new business-specific fields
    const fullBusinessInput: CreateBusinessWithStandardKYBInput = {
        country: "US",
        email: "full-business@example.com",
        // New fields added in this PR:
        account_purpose: "ecommerce_retail_payments" satisfies AccountPurpose,
        business_description: "Software development and consulting services",
        business_industry: "541511" satisfies BusinessIndustry,
        business_type: "corporation" satisfies BusinessType,
        estimated_annual_revenue: "1000000_9999999" satisfies EstimatedAnnualRevenue,
        publicly_traded: false,
        source_of_wealth: "client_investor_contributions" satisfies SourceOfWealth,
        // Owner with new fields:
        owners: [
            {
                role: "beneficial_controlling",
                first_name: "Jane",
                last_name: "Smith",
                date_of_birth: "1985-05-20",
                tax_id: "987-65-4321",
                address_line_1: "789 Owner Lane",
                address_line_2: null,
                city: "San Francisco",
                state_province_region: "CA",
                country: "US",
                postal_code: "94102",
                id_doc_country: "US",
                id_doc_type: "DRIVERS",
                id_doc_front_file: "https://example.com/owner-id-front.jpg",
                id_doc_back_file: "https://example.com/owner-id-back.jpg",
                proof_of_address_doc_type: "BANK_STATEMENT",
                proof_of_address_doc_file: "https://example.com/owner-proof.pdf",
                // New Owner fields:
                ownership_percentage: 51,
                title: "CEO",
            },
        ],
    };

    console.log("Full business input with new fields:", fullBusinessInput);
}

// Run all tests
async function main() {
    // console.log("Testing Receiver Creation from branch: eric/update-receiver-functions\n");
    // console.log("Changes being tested:");
    // console.log("- Only country and email required now (all other fields optional)");
    // console.log("- New enum types: AccountPurpose, BusinessType, BusinessIndustry, EstimatedAnnualRevenue, SourceOfWealth");
    // console.log("- New Owner fields: ownership_percentage, title");
    // console.log("- New individual fields: account_purpose, selfie_file, source_of_wealth");
    // console.log("- New business fields: account_purpose, business_description, business_industry, business_type, estimated_annual_revenue, publicly_traded, source_of_wealth");

    await testCreateIndividualWithStandardKYC();
    // await testCreateIndividualWithEnhancedKYC();
    // await testCreateBusinessWithStandardKYB();

    console.log("\n=== All type checks passed! ===");
}

main().catch(console.error);
