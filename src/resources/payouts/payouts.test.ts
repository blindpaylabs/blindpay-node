import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    AuthorizeStellarTokenResponse,
    CreateEvmPayoutResponse,
    CreateSolanaPayoutResponse,
    CreateStellarPayoutResponse,
    GetPayoutResponse,
    GetPayoutTrackResponse,
    ListPayoutsResponse,
} from ".";

describe("Payouts", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("List payouts", () => {
        it("should list payouts", async () => {
            const mockedPayouts: ListPayoutsResponse = {
                data: [
                    {
                        receiver_id: "re_000000000000",
                        id: "pa_000000000000",
                        status: "processing",
                        sender_wallet_address: "0x123...890",
                        signed_transaction: "AAA...Zey8y0A",
                        quote_id: "qu_000000000000",
                        instance_id: "in_000000000000",
                        tracking_transaction: {
                            step: "processing",
                            status: "failed",
                            transaction_hash: "0x123...890",
                            completed_at: "2011-10-05T14:48:00.000Z",
                        },
                        tracking_payment: {
                            step: "on_hold",
                            provider_name: "blockchain",
                            provider_transaction_id: "0x123...890",
                            provider_status: "canceled",
                            recipient_name: "John Doe",
                            recipient_tax_id: "123.456.789-10",
                            recipient_bank_code: "00416968",
                            recipient_branch_code: "0001",
                            recipient_account_number: "1234567890",
                            recipient_account_type: "checking",
                            estimated_time_of_arrival: "5_min",
                            completed_at: "2011-10-05T14:48:00.000Z",
                        },
                        tracking_liquidity: {
                            step: "processing",
                            provider_transaction_id: "0x123...890",
                            provider_status: "deposited",
                            estimated_time_of_arrival: "1_business_day",
                            completed_at: "2011-10-05T14:48:00.000Z",
                        },
                        tracking_complete: {
                            step: "on_hold",
                            status: "tokens_refunded",
                            transaction_hash: "0x123...890",
                            completed_at: "2011-10-05T14:48:00.000Z",
                        },
                        tracking_partner_fee: {
                            step: "on_hold",
                            transaction_hash: "0x123...890",
                            completed_at: "2011-10-05T14:48:00.000Z",
                        },
                        created_at: "2021-01-01T00:00:00Z",
                        updated_at: "2021-01-01T00:00:00Z",
                        image_url: "https://example.com/image.png",
                        first_name: "John",
                        last_name: "Doe",
                        legal_name: "Company Name Inc.",
                        network: "sepolia",
                        token: "USDC",
                        description: "Memo code or description, only works with USD and BRL",
                        sender_amount: 1010,
                        receiver_amount: 5240,
                        partner_fee_amount: 150,
                        commercial_quotation: 495,
                        blindpay_quotation: 485,
                        total_fee_amount: 1.5,
                        receiver_local_amount: 1000,
                        currency: "BRL",
                        transaction_document_file: "https://example.com/image.png",
                        transaction_document_type: "invoice",
                        transaction_document_id: "1234567890",
                        name: "Bank Account Name",
                        type: "wire",
                        pix_key: "14947677768",
                        account_number: "1001001234",
                        routing_number: "012345678",
                        country: "US",
                        account_class: "individual",
                        address_line_1: "Address line 1",
                        address_line_2: "Address line 2",
                        city: "City",
                        state_province_region: "State/Province/Region",
                        postal_code: "Postal code",
                        account_type: "checking",
                        ach_cop_beneficiary_first_name: "Fernando",
                        ach_cop_bank_account: "12345678",
                        ach_cop_bank_code: "051",
                        ach_cop_beneficiary_last_name: "Guzman Alarcón",
                        ach_cop_document_id: "1661105408",
                        ach_cop_document_type: "CC",
                        ach_cop_email: "fernando.guzman@gmail.com",
                        beneficiary_name: "Individual full name or business name",
                        spei_clabe: "5482347403740546",
                        spei_protocol: "clabe",
                        spei_institution_code: "40002",
                        swift_beneficiary_country: "MX",
                        swift_code_bic: "123456789",
                        swift_account_holder_name: "John Doe",
                        swift_account_number_iban: "123456789",
                        transfers_account: "BM123123123123",
                        transfers_type: "CVU",
                        has_virtual_account: true,
                    },
                ],
                pagination: {
                    has_more: true,
                    next_page: "3",
                    prev_page: "1",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayouts), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayouts);
        });
    });

    describe("Get payout", () => {
        it("should get a payout", async () => {
            const mockedPayout: GetPayoutResponse = {
                receiver_id: "re_000000000000",
                id: "pa_000000000000",
                status: "processing",
                sender_wallet_address: "0x123...890",
                signed_transaction: "AAA...Zey8y0A",
                quote_id: "qu_000000000000",
                instance_id: "in_000000000000",
                tracking_transaction: {
                    step: "processing",
                    status: "failed",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_payment: {
                    step: "on_hold",
                    provider_name: "blockchain",
                    provider_transaction_id: "0x123...890",
                    provider_status: "canceled",
                    recipient_name: "John Doe",
                    recipient_tax_id: "123.456.789-10",
                    recipient_bank_code: "00416968",
                    recipient_branch_code: "0001",
                    recipient_account_number: "1234567890",
                    recipient_account_type: "checking",
                    estimated_time_of_arrival: "5_min",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_liquidity: {
                    step: "processing",
                    provider_transaction_id: "0x123...890",
                    provider_status: "deposited",
                    estimated_time_of_arrival: "1_business_day",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_complete: {
                    step: "on_hold",
                    status: "tokens_refunded",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_partner_fee: {
                    step: "on_hold",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                created_at: "2021-01-01T00:00:00Z",
                updated_at: "2021-01-01T00:00:00Z",
                image_url: "https://example.com/image.png",
                first_name: "John",
                last_name: "Doe",
                legal_name: "Company Name Inc.",
                network: "sepolia",
                token: "USDC",
                description: "Memo code or description, only works with USD and BRL",
                sender_amount: 1010,
                receiver_amount: 5240,
                partner_fee_amount: 150,
                commercial_quotation: 495,
                blindpay_quotation: 485,
                total_fee_amount: 1.5,
                receiver_local_amount: 1000,
                currency: "BRL",
                transaction_document_file: "https://example.com/image.png",
                transaction_document_type: "invoice",
                transaction_document_id: "1234567890",
                name: "Bank Account Name",
                type: "wire",
                pix_key: "14947677768",
                account_number: "1001001234",
                routing_number: "012345678",
                country: "US",
                account_class: "individual",
                address_line_1: "Address line 1",
                address_line_2: "Address line 2",
                city: "City",
                state_province_region: "State/Province/Region",
                postal_code: "Postal code",
                account_type: "checking",
                ach_cop_beneficiary_first_name: "Fernando",
                ach_cop_bank_account: "12345678",
                ach_cop_bank_code: "051",
                ach_cop_beneficiary_last_name: "Guzman Alarcón",
                ach_cop_document_id: "1661105408",
                ach_cop_document_type: "CC",
                ach_cop_email: "fernando.guzman@gmail.com",
                beneficiary_name: "Individual full name or business name",
                spei_clabe: "5482347403740546",
                spei_protocol: "clabe",
                spei_institution_code: "40002",
                swift_beneficiary_country: "MX",
                swift_code_bic: "123456789",
                swift_account_holder_name: "John Doe",
                swift_account_number_iban: "123456789",
                transfers_account: "BM123123123123",
                transfers_type: "CVU",
                has_virtual_account: true,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayout), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.get("pa_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayout);
        });
    });

    describe("Get payout track", () => {
        it("should get payout tracking information", async () => {
            const mockedPayoutTrack: GetPayoutTrackResponse = {
                receiver_id: "re_000000000000",
                id: "pa_000000000000",
                status: "processing",
                sender_wallet_address: "0x123...890",
                signed_transaction: "AAA...Zey8y0A",
                quote_id: "qu_000000000000",
                instance_id: "in_000000000000",
                tracking_transaction: {
                    step: "processing",
                    status: "failed",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_payment: {
                    step: "on_hold",
                    provider_name: "blockchain",
                    provider_transaction_id: "0x123...890",
                    provider_status: "canceled",
                    recipient_name: "John Doe",
                    recipient_tax_id: "123.456.789-10",
                    recipient_bank_code: "00416968",
                    recipient_branch_code: "0001",
                    recipient_account_number: "1234567890",
                    recipient_account_type: "checking",
                    estimated_time_of_arrival: "5_min",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_liquidity: {
                    step: "processing",
                    provider_transaction_id: "0x123...890",
                    provider_status: "deposited",
                    estimated_time_of_arrival: "1_business_day",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_complete: {
                    step: "on_hold",
                    status: "tokens_refunded",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_partner_fee: {
                    step: "on_hold",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                created_at: "2021-01-01T00:00:00Z",
                updated_at: "2021-01-01T00:00:00Z",
                image_url: "https://example.com/image.png",
                first_name: "John",
                last_name: "Doe",
                legal_name: "Company Name Inc.",
                network: "sepolia",
                token: "USDC",
                description: "Memo code or description, only works with USD and BRL",
                sender_amount: 1010,
                receiver_amount: 5240,
                partner_fee_amount: 150,
                commercial_quotation: 495,
                blindpay_quotation: 485,
                total_fee_amount: 1.5,
                receiver_local_amount: 1000,
                currency: "BRL",
                transaction_document_file: "https://example.com/image.png",
                transaction_document_type: "invoice",
                transaction_document_id: "1234567890",
                name: "Bank Account Name",
                type: "wire",
                pix_key: "14947677768",
                account_number: "1001001234",
                routing_number: "012345678",
                country: "US",
                account_class: "individual",
                address_line_1: "Address line 1",
                address_line_2: "Address line 2",
                city: "City",
                state_province_region: "State/Province/Region",
                postal_code: "Postal code",
                account_type: "checking",
                ach_cop_beneficiary_first_name: "Fernando",
                ach_cop_bank_account: "12345678",
                ach_cop_bank_code: "051",
                ach_cop_beneficiary_last_name: "Guzman Alarcón",
                ach_cop_document_id: "1661105408",
                ach_cop_document_type: "CC",
                ach_cop_email: "fernando.guzman@gmail.com",
                beneficiary_name: "Individual full name or business name",
                spei_clabe: "5482347403740546",
                spei_protocol: "clabe",
                spei_institution_code: "40002",
                swift_beneficiary_country: "MX",
                swift_code_bic: "123456789",
                swift_account_holder_name: "John Doe",
                swift_account_number_iban: "123456789",
                transfers_account: "BM123123123123",
                transfers_type: "CVU",
                has_virtual_account: true,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayoutTrack), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.getTrack("pa_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayoutTrack);
        });
    });

    describe("Authorize stellar token", () => {
        it("should authorize stellar token", async () => {
            const mockedAuthorizeToken: AuthorizeStellarTokenResponse = {
                transaction_hash: "string",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedAuthorizeToken), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.authorizeStellarToken({
                quote_id: "qu_000000000000",
                sender_wallet_address: "0x123...890",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedAuthorizeToken);
        });
    });

    describe("Create stellar payout", () => {
        it("should create a stellar payout", async () => {
            const mockedStellarPayout: CreateStellarPayoutResponse = {
                id: "pa_000000000000",
                status: "processing",
                sender_wallet_address: "0x123...890",
                tracking_complete: {
                    step: "on_hold",
                    status: "tokens_refunded",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_payment: {
                    step: "on_hold",
                    provider_name: "blockchain",
                    provider_transaction_id: "0x123...890",
                    provider_status: "canceled",
                    recipient_name: "John Doe",
                    recipient_tax_id: "123.456.789-10",
                    recipient_bank_code: "00416968",
                    recipient_branch_code: "0001",
                    recipient_account_number: "1234567890",
                    recipient_account_type: "checking",
                    estimated_time_of_arrival: "5_min",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_transaction: {
                    step: "processing",
                    status: "failed",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_partner_fee: {
                    step: "on_hold",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_liquidity: {
                    step: "processing",
                    provider_transaction_id: "0x123...890",
                    provider_status: "deposited",
                    estimated_time_of_arrival: "1_business_day",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                receiver_id: "re_000000000000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedStellarPayout), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.createStellar({
                quote_id: "qu_000000000000",
                sender_wallet_address: "0x123...890",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedStellarPayout);
        });
    });

    describe("Create EVM payout", () => {
        it("should create an EVM payout", async () => {
            const mockedEvmPayout: CreateEvmPayoutResponse = {
                id: "pa_000000000000",
                status: "processing",
                sender_wallet_address: "0x123...890",
                tracking_complete: {
                    step: "on_hold",
                    status: "tokens_refunded",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_payment: {
                    step: "on_hold",
                    provider_name: "blockchain",
                    provider_transaction_id: "0x123...890",
                    provider_status: "canceled",
                    recipient_name: "John Doe",
                    recipient_tax_id: "123.456.789-10",
                    recipient_bank_code: "00416968",
                    recipient_branch_code: "0001",
                    recipient_account_number: "1234567890",
                    recipient_account_type: "checking",
                    estimated_time_of_arrival: "5_min",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_transaction: {
                    step: "processing",
                    status: "failed",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_partner_fee: {
                    step: "on_hold",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_liquidity: {
                    step: "processing",
                    provider_transaction_id: "0x123...890",
                    provider_status: "deposited",
                    estimated_time_of_arrival: "1_business_day",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                receiver_id: "re_000000000000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedEvmPayout), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.createEvm({
                quote_id: "qu_000000000000",
                sender_wallet_address: "0x123...890",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedEvmPayout);
        });
    });

    describe("Create solana payout", () => {
        it("should create a solana payout", async () => {
            const mockedSolanaPayout: CreateSolanaPayoutResponse = {
                id: "pa_000000000000",
                status: "processing",
                sender_wallet_address: "0x123...890",
                tracking_complete: {
                    step: "on_hold",
                    status: "tokens_refunded",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_payment: {
                    step: "on_hold",
                    provider_name: "blockchain",
                    provider_transaction_id: "0x123...890",
                    provider_status: "canceled",
                    recipient_name: "John Doe",
                    recipient_tax_id: "123.456.789-10",
                    recipient_bank_code: "00416968",
                    recipient_branch_code: "0001",
                    recipient_account_number: "1234567890",
                    recipient_account_type: "checking",
                    estimated_time_of_arrival: "5_min",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_transaction: {
                    step: "processing",
                    status: "failed",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_partner_fee: {
                    step: "on_hold",
                    transaction_hash: "0x123...890",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                tracking_liquidity: {
                    step: "processing",
                    provider_transaction_id: "0x123...890",
                    provider_status: "deposited",
                    estimated_time_of_arrival: "1_business_day",
                    completed_at: "2011-10-05T14:48:00.000Z",
                },
                receiver_id: "re_000000000000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedSolanaPayout), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payouts.createSolana({
                quote_id: "qu_000000000000",
                sender_wallet_address: "0x123...890",
                signed_transaction: "AAA...Zey8y0A",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedSolanaPayout);
        });
    });
});
