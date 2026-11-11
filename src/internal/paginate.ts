import type { BlindpayApiResponse, PaginationMetadata } from "../../types";
import { BlindPayError } from "./blindpay-error";

/** A list response: the `{ data, pagination }` envelope, or a bare array (no pagination sent). */
export type Page<T> = { data: T[]; pagination: PaginationMetadata } | T[];

type CursorParams = { limit?: string | number; starting_after?: string; ending_before?: string };

/**
 * Iterates every item of a cursor-paginated list (sdk-parity C5/D4): sends `limit` (default
 * `"100"`, valid for every list) so the API answers with the envelope, then follows
 * `pagination.next_page` as `starting_after` while `has_more` is true.
 *
 * Forward only: `ending_before` is rejected. A failed page throws a `BlindPayError` whose
 * `error` is the page's `ErrorResponse` (each page goes through the normal retry policy first).
 */
export async function* autoPage<T, P extends CursorParams>(
    fetchPage: (params: P) => Promise<BlindpayApiResponse<Page<T>>>,
    params?: P
): AsyncGenerator<T, void, undefined> {
    if (params?.ending_before !== undefined) {
        throw new BlindPayError(
            "Auto-pagination goes forward only: pass starting_after, not ending_before"
        );
    }
    let cursor = params?.starting_after;
    for (;;) {
        const { data, error } = await fetchPage({
            ...params,
            limit: params?.limit ?? "100",
            starting_after: cursor,
        } as P);
        if (error) throw new BlindPayError(error.message, error);
        if (Array.isArray(data)) {
            yield* data;
            return;
        }
        yield* data.data;
        const next = data.pagination?.has_more ? data.pagination.next_page : null;
        if (!next) return;
        if (next === cursor) {
            throw new BlindPayError(
                `Pagination did not advance: next_page is still "${next}" while has_more is true`
            );
        }
        cursor = next;
    }
}
