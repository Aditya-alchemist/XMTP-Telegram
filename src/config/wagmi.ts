import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'ff049f17-f9f3-4c91-b433-4cec39eb1836'

// Custom metadata
const metadata = {
  name: 'XMTP Telegram',
  description: 'Decentralized messaging powered by XMTP',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/82580170']
}

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '9999'
        }
      }
    })
  ],
  ssr: false,
})
