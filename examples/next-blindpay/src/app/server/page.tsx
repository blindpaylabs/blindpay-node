import { Blindpay } from "blindpay";
const blindpay = new Blindpay('your-api-key'); // This cannot be created on the client side

export default async function Home() {
  async function getData() {
    'use server'
  
    const response = await blindpay.payouts.retrievePayoutTrack('po_...');
  
    return response.data;
  }

  const payout = await getData();

  if (!payout) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Payout Details</h1>
            <span className="capitalize px-3 py-1 rounded-full bg-gray-100">
              {payout.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{payout.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Network</p>
                <p className="font-medium">{payout.network}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{payout.amount} {payout.token}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Receiver Amount</p>
                <p className="font-medium">{payout.receiver_amount} {payout.token}</p>
              </div>
            </div>

            {payout.tracking_transaction && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Transaction Hash</p>
                  <p className="font-mono text-sm break-all">{payout.tracking_transaction.transaction_hash}</p>
                  <p className="text-sm text-gray-500 mt-2">Completed At</p>
                  <p>{new Date(payout.tracking_transaction.completed_at).toLocaleString()}</p>
                </div>
              </div>
            )}

            {payout.tracking_payment && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Provider</p>
                  <p>{payout.tracking_payment.provider_name}</p>
                  <p className="text-sm text-gray-500 mt-2">Transaction ID</p>
                  <p className="font-mono text-sm">{payout.tracking_payment.provider_transaction_id}</p>
                  <p className="text-sm text-gray-500 mt-2">Status</p>
                  <p>{payout.tracking_payment.provider_status}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}