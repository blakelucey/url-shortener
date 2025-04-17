// app/Providers.tsx
"use client";

import {
    QueryClient,
    QueryClientProvider,
    isServer,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { projectId, wagmiAdapter, networks } from "@/lib/walletConfig";
import { AppKitNetwork } from "@reown/appkit/networks";
// import { logFn } from "../../../logging/logging";
// const log = logFn("src.app.Providers.tsx");

// Set up QueryClient
function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(): QueryClient {
    if (isServer) {
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

// Metadata for WalletConnect
const metadata = {
    name: "defi-yield-aggregator",
    description: "Stake Yield Aggregator",
    url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// log('metadata', 'info', metadata);
// log('networks', 'info', networks)

// Initialize AppKit modal
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: networks as [AppKitNetwork, ...AppKitNetwork[]],
    defaultNetwork: networks[0], // mainnet
    metadata,
    features: {
        analytics: true,
        socials: ["google", "x", "github", "discord"],
        email: true,
    },
});

interface ProvidersProps {
    children: ReactNode;
    cookies?: string | null;
}

export default function Providers({ children, cookies }: ProvidersProps) {
    const queryClient = getQueryClient();
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

    //   log('cookies', 'info', cookies);
    //   log('initialState', 'info', initialState);
    //   log('queryClient', 'info', queryClient);

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}