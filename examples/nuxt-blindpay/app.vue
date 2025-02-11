<script setup lang="ts">
import { type Payout } from 'blindpay'

const { data } = await useFetch<{ data: Payout }>('/api/track')
const payout = computed(() => data.value?.data)
</script>

<template>
  <div class="container">
    <div v-if="data == null" class="loading">
      Loading...
    </div>
    <div v-else class="layout">
      <main class="main">
        <div class="card">
          <div class="header">
            <h1 class="title">Payout Details</h1>
            <span class="status-badge">
              {{ payout?.status }}
            </span>
          </div>

          <div class="content">
            <div class="grid">
              <div class="grid-item">
                <p class="label">ID</p>
                <p class="value">{{ payout?.id }}</p>
              </div>
              <div class="grid-item">
                <p class="label">Network</p>
                <p class="value">{{ payout?.network }}</p>
              </div>
            </div>

            <div class="grid">
              <div class="grid-item">
                <p class="label">Amount</p>
                <p class="value">{{ payout?.amount }} {{ payout?.token }}</p>
              </div>
              <div class="grid-item">
                <p class="label">Receiver Amount</p>
                <p class="value">{{ payout?.receiver_amount }} {{ payout?.token }}</p>
              </div>
            </div>

            <div v-if="payout?.tracking_transaction" class="section">
              <h2 class="section-title">Transaction Details</h2>
              <div class="details-box">
                <p class="label">Transaction Hash</p>
                <p class="hash">{{ payout.tracking_transaction.transaction_hash }}</p>
                <p class="label">Completed At</p>
                <p class="value">{{ new Date(payout.tracking_transaction.completed_at).toLocaleString() }}</p>
              </div>
            </div>

            <div v-if="payout?.tracking_payment" class="section">
              <h2 class="section-title">Payment Details</h2>
              <div class="details-box">
                <p class="label">Provider</p>
                <p class="value">{{ payout.tracking_payment.provider_name }}</p>
                <p class="label">Transaction ID</p>
                <p class="mono">{{ payout.tracking_payment.provider_transaction_id }}</p>
                <p class="label">Status</p>
                <p class="value">{{ payout.tracking_payment.provider_status }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
body {
  background-color: black;
  margin: 0;
  min-height: 100vh;
}
</style>

<style scoped>
.container {
  min-height: 100vh;
  padding: 2rem 1.25rem 5rem;
  background-color: black;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.layout {
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  align-items: center;
  justify-items: center;
  gap: 4rem;
}

.main {
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 42rem;
}

.card {
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
}

.status-badge {
  text-transform: capitalize;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.grid-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.875rem;
  color: #6b7280;
}

.value {
  font-weight: 500;
}

.section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.details-box {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
}

.hash, .mono {
  font-family: monospace;
  font-size: 0.875rem;
  word-break: break-all;
}

@media (min-width: 640px) {
  .container {
    padding: 5rem 2rem;
  }
  
  .main {
    align-items: flex-start;
  }
}
</style>