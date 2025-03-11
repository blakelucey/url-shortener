"use client";

import { useAccount } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { ModeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import TypingText from "@/components/textAnimation";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";


export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false); // Use isMounted instead of isClient
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Set after client-side mount

    if(isConnected){
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  if (!isMounted) {
    return <div className="light">{/* Placeholder */}</div>;
  }

  const handleConnect = async () => {
    console.log("Opening AppKit modal...");
    open();
  };

  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    disconnect();
  };

  // Render skeleton or empty state on the server, full content on the client
  return (
    <div className={theme}>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-5 right-5">
          <ModeToggle />
        </div>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-8">
            <h1 className="scroll-m-40 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Shorten Your Links, Simplify Your Life
            </h1>
            <h5 className="scroll-m-20 text-2xl tracking-tight">
              <TypingText />
            </h5>
            {isMounted && !isConnected ? (
              <div className="flex items-center justify-center space-x-2 tracking-tight">
                <p className="text-center light">Sign In/Sign Up</p>
                <Button onClick={handleConnect} className="inline-flex items-center">
                  <Icons.LucideLogIn className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 tracking-tight">
                <p className="text-center light">Sign Out</p>
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  className="inline-flex items-center"
                >
                  <Icons.LucideLogOut />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}