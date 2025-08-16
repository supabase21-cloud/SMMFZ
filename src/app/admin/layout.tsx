
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.email !== "admin@gmail.com") {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.email !== "admin@gmail.com") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading or Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
       <Header />
       <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
        </main>
       </div>
      <Toaster />
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
