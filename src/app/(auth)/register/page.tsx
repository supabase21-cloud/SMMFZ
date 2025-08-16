
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
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/data";
import { Eye, EyeOff } from "lucide-react";

const SESSION_STORAGE_KEY_EMAIL = 'register_email';
const SESSION_STORAGE_KEY_PASSWORD = 'register_password';
const SESSION_STORAGE_KEY_CONFIRM = 'register_confirm_password';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // --- State Persistence ---
  useEffect(() => {
    const savedEmail = sessionStorage.getItem(SESSION_STORAGE_KEY_EMAIL);
    const savedPassword = sessionStorage.getItem(SESSION_STORAGE_KEY_PASSWORD);
    const savedConfirm = sessionStorage.getItem(SESSION_STORAGE_KEY_CONFIRM);
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedConfirm) setConfirmPassword(savedConfirm);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY_EMAIL, email);
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY_PASSWORD, password);
  }, [password]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY_CONFIRM, confirmPassword);
  }, [confirmPassword]);

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
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const { user, error } = await registerUser({ email, password });

    if (user) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY_EMAIL);
      sessionStorage.removeItem(SESSION_STORAGE_KEY_PASSWORD);
      sessionStorage.removeItem(SESSION_STORAGE_KEY_CONFIRM);
      toast({
        title: "Success",
        description: "Registration successful! Please log in.",
      });
      router.push("/login");
    } else {
      toast({
        title: "Registration Failed",
        description: error || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
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
            />
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2.5 top-7 h-7 w-7"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2.5 top-7 h-7 w-7"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle confirm password visibility</span>
            </Button>
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
