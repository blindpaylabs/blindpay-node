import type { ErrorResponse } from "../../types";

const OPTIONAL_STRING_FIELDS = ["code", "description", "trace_id"] as const;

/**
 * Maps a non-2xx JSON body (the API's `Error` envelope) onto the SDK's `error` object, keeping
 * only the documented fields and only when they have the documented type.
 */
export function toErrorResponse(body: unknown): ErrorResponse {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { message: "Unknown error" };
    }
    const fields = body as Record<string, unknown>;
    const error: ErrorResponse = {
        message: typeof fields.message === "string" ? fields.message : "Unknown error",
    };
    for (const key of OPTIONAL_STRING_FIELDS) {
        const value = fields[key];
        if (typeof value === "string") error[key] = value;
    }
    if (Array.isArray(fields.errors) && fields.errors.every((e) => typeof e === "string")) {
        error.errors = fields.errors;
    }
    return error;
}
