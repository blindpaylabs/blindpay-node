import type { BlindpayApiResponse, PaginationMetadata } from "../../types";
import { BlindPayError } from "./blindpay-error";

/** A list response: the `{ data, pagination }` envelope, or a bare array (no pagination sent). */
export type Page<T> = { data: T[]; pagination: PaginationMetadata } | T[];

type CursorParams = { limit?: string | number; starting_after?: string; ending_before?: string };

/**
 * Iterates every item of a cursor-paginated list: sends `limit` (default
 * `"100"`, valid for every list) so the API answers with the envelope, then follows
 * `pagination.next_page` as `starting_after` while `has_more` is true.
 *
 * Forward only: `ending_before` is rejected. A failed page throws a `BlindPayError` whose
 * `error` is the page's `ErrorResponse` (each page goes through the normal retry policy first).
 * A `next_page` the iterator already requested (repeated or cyclic cursors) throws instead of
 * looping forever.
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
    // Every cursor sent so far: a server that hands back one it already gave (the same token
    // twice in a row, or a cycle such as a -> b -> a) would otherwise be paged forever.
    const sent = new Set<string>(cursor === undefined ? [] : [cursor]);
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
        if (sent.has(next)) {
            throw new BlindPayError(
                next === cursor
                    ? `Pagination did not advance: next_page is still "${next}" while has_more is true`
                    : `Pagination looped: next_page "${next}" was already requested while has_more is true`
            );
        }
        sent.add(next);
        cursor = next;
    }
}
