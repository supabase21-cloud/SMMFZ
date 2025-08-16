
"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";

function AppLayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <WhatsAppButton 
        phoneNumber="923138697887"
        message="I need help for your social service deposit"
      />
    </div>
  );
}


export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </AuthProvider>
  );
}
