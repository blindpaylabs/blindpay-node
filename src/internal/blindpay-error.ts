export class BlindpayError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BlindpayError";
    }
}
