
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SESSION_STORAGE_KEY_EMAIL = 'login_email';
const SESSION_STORAGE_KEY_PASSWORD = 'login_password';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // --- State Persistence ---
  useEffect(() => {
    const savedEmail = sessionStorage.getItem(SESSION_STORAGE_KEY_EMAIL);
    const savedPassword = sessionStorage.getItem(SESSION_STORAGE_KEY_PASSWORD);
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY_EMAIL, email);
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY_PASSWORD, password);
  }, [password]);

  // Auto-refresh on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.location.reload();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { success, error } = await login({ email, password });
    
    setIsSubmitting(false);

    if (success) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY_EMAIL);
      sessionStorage.removeItem(SESSION_STORAGE_KEY_PASSWORD);
      if (email === "admin@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: error || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2 relative">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2.5 top-7 h-7 w-7"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className={isSubmitting ? "pointer-events-none text-muted-foreground" : "underline"}>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
