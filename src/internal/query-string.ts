export function buildQueryString(params: Record<string, string | undefined>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value != null) searchParams.set(key, value);
    }
    return searchParams.size ? `?${searchParams}` : "";
}
