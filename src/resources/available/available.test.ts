import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { GetBankDetailsResponse, GetRailsResponse, GetSwiftCodeBankDetailsResponse } from ".";

describe("Available", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Get bank details", () => {
        it("should get bank details for a rail", async () => {
            const mockedBankDetails: GetBankDetailsResponse = [
                {
                    label: "Account Type",
                    regex: "",
                    key: "account_type",
                    items: [
                        {
                            label: "Checking",
                            value: "checking",
                        },
                        {
                            label: "Savings",
                            value: "saving",
                        },
                    ],
                    required: true,
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedBankDetails), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.available.getBankDetails("pix");

            expect(error).toBeNull();
            expect(data).toEqual(mockedBankDetails);
        });
    });

    describe("Get rails", () => {
        it("should get available rails", async () => {
            const mockedRails: GetRailsResponse = [
                {
                    label: "Domestic Wire",
                    value: "wire",
                    country: "US",
                },
                {
                    label: "ACH",
                    value: "ach",
                    country: "US",
                },
                {
                    label: "PIX",
                    value: "pix",
                    country: "BR",
                },
                {
                    label: "SPEI",
                    value: "spei_bitso",
                    country: "MX",
                },
                {
                    label: "Transfers 3.0",
                    value: "transfers_bitso",
                    country: "AR",
                },
                {
                    label: "ACH Colombia",
                    value: "ach_cop_bitso",
                    country: "CO",
                },
                {
                    label: "International Swift",
                    value: "international_swift",
                    country: "US",
                },
                {
                    label: "RTP",
                    value: "rtp",
                    country: "US",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedRails), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.available.getRails();

            expect(error).toBeNull();
            expect(data).toEqual(mockedRails);
        });
    });

    describe("Get swift code bank details", () => {
        it("should get bank details of a swift code", async () => {
            const mockedBankDetails: GetSwiftCodeBankDetailsResponse = [
                {
                    id: "416",
                    bank: "BANK OF AMERICA, N.A.",
                    city: "NEW JERSEY",
                    branch: "LENDING SERVICES AND OPERATIONS (LSOP)",
                    swiftCode: "BOFAUS3NLMA",
                    swiftCodeLink: "https://bank.codes/swift-code/united-states/bofaus3nlma/",
                    country: "United States",
                    countrySlug: "united-states",
                },
            ];
            fetchMock.mockResponseOnce(JSON.stringify(mockedBankDetails), {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const { data, error } = await blindpay.available.getSwiftCodeBankDetails("BOFAUS3NLMA");

            expect(error).toBeNull();
            expect(data).toEqual(mockedBankDetails);
        });
    });
});
