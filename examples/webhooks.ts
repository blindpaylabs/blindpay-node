// Workflow 1: register a webhook endpoint, then verify and handle deliveries.
// Verify against the RAW request body: a re-serialized object never matches the signature.
import { BlindPay, constructWebhookEvent, isUnknownWebhookEvent } from "../src";

const blindpay = new BlindPay({
    apiKey: process.env.BLINDPAY_API_KEY ?? "",
    instanceId: process.env.BLINDPAY_INSTANCE_ID ?? "",
});

export async function registerEndpoint(url: string): Promise<string> {
    const { data, error } = await blindpay.instances.webhookEndpoints.create({
        url,
        events: ["payout.update", "payout.complete", "payin.complete"],
    });
    if (error) throw new Error(error.message);
    // The signing secret (whsec_...) comes from getSecret(id). Store it; never log it.
    const secret = await blindpay.instances.webhookEndpoints.getSecret(data.id);
    if (secret.error) throw new Error(secret.error.message);
    return secret.data.key;
}

/** Delivery ids already handled; Svix retries, so dedupe on `svix-id` (use your database). */
const seen = new Set<string>();

/**
 * A Web-standard handler (Request in, Response out). Mount it on any HTTPS endpoint:
 * a Next.js route handler (`export const POST = (req: Request) => handleWebhook(req, secret)`),
 * `Bun.serve`, Hono, Cloudflare Workers, or Express via an adapter. BlindPay only delivers to https URLs.
 */
export async function handleWebhook(request: Request, secret: string): Promise<Response> {
    // Read the RAW body: with Express use express.raw({ type: "application/json" }), never express.json().
    const rawBody = new Uint8Array(await request.arrayBuffer());
    let event: ReturnType<typeof constructWebhookEvent>;
    try {
        event = constructWebhookEvent(rawBody, request.headers, secret);
    } catch {
        return new Response(null, { status: 400 });
    }
    const deliveryId = request.headers.get("svix-id") ?? "";
    if (!seen.has(deliveryId)) {
        seen.add(deliveryId);
        handle(event);
    }
    return new Response(null, { status: 200 });
}

function handle(event: ReturnType<typeof constructWebhookEvent>): void {
    if (isUnknownWebhookEvent(event)) return; // an event newer than this SDK: event.raw has it
    switch (event.webhook_event) {
        case "payout.update":
        case "payout.complete":
            // A failed payout can arrive on either event: branch on status, not the name.
            if (event.status === "failed") console.log("payout failed", event.id);
            else if (event.status === "completed") console.log("payout completed", event.id);
            break;
        case "payin.complete":
            console.log("payin completed", event.id);
            break;
    }
}
