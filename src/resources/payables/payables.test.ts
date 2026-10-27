import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreatePayableInput,
    CreatePayableResponse,
    DeletePayableResponse,
    GetPayableResponse,
    ListPayablesResponse,
    Payable,
} from ".";

describe("Payables", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    const boletoPayable: Payable = {
        id: "pb_000000000000",
        instance_id: "in_000000000000",
        customer_id: "re_000000000000",
        currency: "BRL",
        status: "draft",
        amount: 15000,
        from: null,
        to: {
            legal_name: "Companhia de Energia SA",
            address_line_1: null,
            address_line_2: null,
            city: null,
            state_province_region: null,
            postal_code: null,
            country: "BR",
            tax_id: "12345678000199",
        },
        line_items: [],
        note: null,
        discount: null,
        taxes: null,
        boleto_barcode: "23793381286000000000000000000000000000000000",
        pix_qrcode: null,
        document_file: null,
        due_date: "2026-11-10",
        scheduled_at: null,
        created_at: "2026-10-27T00:00:00Z",
        updated_at: "2026-10-27T00:00:00Z",
        payout_id: null,
        last_attempt_status: null,
        first_name: null,
        last_name: null,
        legal_name: "Acme Ltda",
    };

    const invoicePayable: Payable = {
        id: "pb_000000000001",
        instance_id: "in_000000000000",
        customer_id: "re_000000000000",
        currency: "USD",
        status: "draft",
        amount: 120000,
        from: { legal_name: "Acme Inc" },
        to: { legal_name: "Northwind Cloud Services Inc", country: "US" },
        line_items: [{ name: "Cloud hosting", quantity: 1, price: 120000 }],
        note: "October invoice",
        discount: null,
        taxes: null,
        bank_account: {
            type: "ach",
            beneficiary_name: "Northwind Cloud Services Inc",
            routing_number: "021000021",
            account_number: "123456789",
            account_type: "checking",
        },
    };

    describe("List payables without pagination params", () => {
        it("should return a plain array", async () => {
            const mockedResponse: ListPayablesResponse = [];

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payables.list();

            expect(error).toBeNull();
            expect(data).toEqual([]);
            expect(fetchMock.mock.calls[0][0]).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/payables"
            );
        });
    });

    describe("List payables", () => {
        it("should list payables", async () => {
            const mockedPayables: ListPayablesResponse = {
                data: [boletoPayable],
                pagination: {
                    has_more: false,
                    next_page: null,
                    prev_page: null,
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayables), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payables.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayables);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/instances/in_000000000000/payables");
            expect(init?.method).toBe("GET");
        });

        it("should pass filters as query params", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({
                    data: [],
                    pagination: { has_more: false, next_page: null, prev_page: null },
                }),
                { headers: { "Content-Type": "application/json" } }
            );

            const { error } = await blindpay.payables.list({
                limit: "10",
                status: "draft",
                type: "boleto",
                customer_id: "re_000000000000",
            });

            expect(error).toBeNull();

            const [url] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/payables?limit=10&status=draft&type=boleto&customer_id=re_000000000000"
            );
        });
    });

    describe("Create payable", () => {
        it("should create a boleto payable", async () => {
            const mockedPayable: CreatePayableResponse = boletoPayable;

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayable), {
                headers: { "Content-Type": "application/json" },
            });

            const input: CreatePayableInput = {
                customer_id: "re_000000000000",
                currency: "BRL",
                boleto_barcode: "23793381286000000000000000000000000000000000",
            };

            const { data, error } = await blindpay.payables.create(input);

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayable);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/instances/in_000000000000/payables");
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual(input);
        });

        it("should create an invoice payable with a bank account", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(invoicePayable), {
                headers: { "Content-Type": "application/json" },
            });

            const input: CreatePayableInput = {
                customer_id: "re_000000000000",
                currency: "USD",
                from: { legal_name: "Acme Inc" },
                to: { legal_name: "Northwind Cloud Services Inc", country: "US" },
                line_items: [{ name: "Cloud hosting", quantity: 1, price: 120000 }],
                note: "October invoice",
                due_date: "2026-11-30",
                bank_account: {
                    type: "ach",
                    name: "Northwind Cloud Services Inc",
                    beneficiary_name: "Northwind Cloud Services Inc",
                    routing_number: "021000021",
                    account_number: "123456789",
                    account_type: "checking",
                    account_class: "business",
                    recipient_relationship: "vendor_or_supplier",
                    address_line_1: "1 Market St",
                    city: "San Francisco",
                    state_province_region: "CA",
                    country: "US",
                    postal_code: "94105",
                },
            };

            const { data, error } = await blindpay.payables.create(input);

            expect(error).toBeNull();
            expect(data).toEqual(invoicePayable);

            const [, init] = fetchMock.mock.calls[0];
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual(input);
        });
    });

    describe("Get payable", () => {
        it("should get a payable", async () => {
            const mockedPayable: GetPayableResponse = boletoPayable;

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayable), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payables.get("pb_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayable);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/payables/pb_000000000000"
            );
            expect(init?.method).toBe("GET");
        });
    });

    describe("Delete payable", () => {
        it("should delete a payable", async () => {
            const mockedPayable: DeletePayableResponse = { ...boletoPayable, status: "canceled" };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayable), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payables.delete("pb_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayable);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/payables/pb_000000000000"
            );
            expect(init?.method).toBe("DELETE");
        });
    });
});
