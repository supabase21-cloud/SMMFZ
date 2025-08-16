import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        {children}
      </div>
    </AuthProvider>
  );
}
