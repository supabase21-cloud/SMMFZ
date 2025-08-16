
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { getUser, type User } from "@/lib/data";
import type { AuthChangeEvent, Session, AuthError } from "@supabase/supabase-js";
import { requestNotificationPermission, saveTokenToDb } from "@/lib/notifications";


interface AuthContextType {
  user: User | null;
  login: (credentials: Pick<User, "email" | "password">) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setupNotifications = useCallback(async (userId: string) => {
    const token = await requestNotificationPermission();
    if (token && userId) {
      await saveTokenToDb(userId, token);
    }
  }, []);

  const fetchUserByEmail = useCallback(async (email: string) => {
    try {
      const profile = await getUser(email);
      setUser(profile);
      if (profile) {
        // If the user is the admin, set up notifications
        if (profile.email === 'admin@gmail.com') {
           await setupNotifications(profile.id);
        }
      }
    } catch(e) {
      console.error("Error fetching user profile", e);
      setUser(null);
    }
  }, [setupNotifications]);

  const refreshUser = useCallback(async () => {
    if (user?.email) {
      setIsLoading(true);
      try {
        await fetchUserByEmail(user.email);
      } catch (e) {
        console.error("Error refreshing user:", e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, fetchUserByEmail]);

  useEffect(() => {
    const handleAuthStateChange = async (event: AuthChangeEvent, session: Session | null) => {
        try {
            if (session?.user?.email) {
                await fetchUserByEmail(session.user.email);
            } else {
                setUser(null);
            }
        } catch(e) {
            console.error("Auth state change error:", e);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Check initial session
    const checkInitialSession = async () => {
        setIsLoading(true);
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error && (error as AuthError).message !== 'Invalid Refresh Token: Refresh Token Not Found') {
                console.error("Error getting session:", error);
            }
            
            await handleAuthStateChange('INITIAL_SESSION', session);
        } catch (e) {
            console.error("Failed to check initial session:", e);
            setUser(null);
        } finally {
             setIsLoading(false);
        }
    };
    
    checkInitialSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
            setIsLoading(true);
            await handleAuthStateChange(event, session);
        }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserByEmail]);

  const login = async ({ email, password }: Pick<User, "email" | "password">) => {
    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch (error) {
        console.error("Login failed:", error);
        return { success: false, error: "Failed to fetch. Please check your Supabase credentials in your environment variables." };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = { user, login, logout, isLoading, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
