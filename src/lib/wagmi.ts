import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Base Mainnet with Denim Upgrade: 200ms native canonical blocks
// Flashblocks are retired; transactions confirm directly in 200ms canonical blocks.
export const BASE_DENIM_BLOCK_TIME_MS = 200;

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  pollingInterval: BASE_DENIM_BLOCK_TIME_MS,
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
})

