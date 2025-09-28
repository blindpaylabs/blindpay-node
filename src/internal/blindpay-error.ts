export class BlindPayError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BlindpayError";
    }
}
