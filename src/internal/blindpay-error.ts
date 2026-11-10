import type { ErrorResponse } from "../../types";

export class BlindPayError extends Error {
    /** The API error behind this exception, when there is one (e.g. a failed page of an auto-pager). */
    readonly error?: ErrorResponse;

    constructor(message: string, error?: ErrorResponse) {
        super(message);
        this.name = "BlindPayError";
        if (error) this.error = error;
    }
}
