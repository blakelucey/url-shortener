// apps/nextjs/lib/walletConfig.ts
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
  sepolia,
  type AppKitNetwork,
} from "@reown/appkit/networks";

export const projectId = "d0ee3885392352f8334a97a5de03e2a8";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Define networks explicitly as AppKitNetwork[]
export const networks: AppKitNetwork[] = [
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
  sepolia,
];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks, // AppKitNetwork[] is fine here
});

export const config = wagmiAdapter.wagmiConfig;