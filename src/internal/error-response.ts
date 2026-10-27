import type { ErrorResponse } from "../../types";

/** Maps a non-2xx JSON body (the API's `Error` envelope) onto the SDK's `error` object. */
export function toErrorResponse(body: unknown): ErrorResponse {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { message: "Unknown error" };
    }
    // `success: false` only restates what `data: null` already says.
    const { success: _success, ...error } = body as Partial<ErrorResponse> & { success?: boolean };
    return { ...error, message: error.message ?? "Unknown error" };
}
