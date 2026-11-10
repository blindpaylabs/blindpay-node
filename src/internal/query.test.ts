import { describe, expect, it } from "vitest";
import { toQueryString } from "./query";

describe("toQueryString", () => {
    it("skips undefined, null and empty values", () => {
        expect(
            toQueryString({ status: undefined, limit: "10", customer_id: null, starting_after: "" })
        ).toBe("?limit=10");
    });

    it("returns an empty string when nothing is set", () => {
        expect(toQueryString()).toBe("");
        expect(toQueryString({})).toBe("");
        expect(toQueryString({ status: undefined })).toBe("");
    });

    it("keeps insertion order and stringifies numbers and booleans", () => {
        expect(toQueryString({ b: 1, a: true, c: "x" })).toBe("?b=1&a=true&c=x");
    });

    it("percent-encodes names and values", () => {
        expect(toQueryString({ customer_name: "Ana & Bia", "a b": "c/d" })).toBe(
            "?customer_name=Ana+%26+Bia&a+b=c%2Fd"
        );
    });
});
