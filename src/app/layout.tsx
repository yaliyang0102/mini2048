import type { Metadata } from "next";
import { Providers } from "./providers";
import ErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "2048 NFT Game",
  description: "Play 2048 and mint NFTs on Base!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      
        
          
            {children}
          
        
      
    
  );
}
