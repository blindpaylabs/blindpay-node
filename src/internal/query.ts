/**
 * Serialises list filters into a query string such as `?limit=10&status=completed`.
 *
 * Absent values (`undefined`, `null`, `""`) are skipped, so an unset filter is never sent as
 * the literal text `"undefined"`. Returns `""` when nothing is left, so the URL gets no bare `?`.
 * Keys keep their insertion order.
 */
export function toQueryString(params: object = {}): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        query.append(key, String(value));
    }
    const serialized = query.toString();
    return serialized ? `?${serialized}` : "";
}
