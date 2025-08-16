
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Menu, LayoutDashboard, LogIn, LogOut, UserPlus, DollarSign, ShoppingCart, Settings, Users, KeyRound, PlusCircle, MessageSquare } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import InstallPWA from "./InstallPWA";

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  const isAdmin = user?.email === "admin@gmail.com";
  const isHomePage = pathname === '/';

  const authLinks = (
    <>
      <InstallPWA />
      {user ? (
        <>
          <Button asChild variant="ghost">
            <Link href={isAdmin ? "/admin" : "/dashboard"}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="ghost">
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
            </Link>
          </Button>
        </>
      )}
    </>
  );

  const mobileNavLinks = (
    <>
        <SheetClose asChild>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Logo className="h-6 w-6" />
                <span>FZBoostify</span>
            </Link>
        </SheetClose>
        {user ? (
          <>
            <SheetClose asChild>
                <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
            </SheetClose>
             {!isAdmin && (
              <>
                <SheetClose asChild>
                    <Link href="/order" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <PlusCircle className="h-5 w-5" /> New Order
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link href="/deposit" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <DollarSign className="h-5 w-5" /> Deposit
                    </Link>
                </SheetClose>
              </>
            )}
             {isAdmin && <AdminMobileNav />}
            <SheetClose asChild>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground justify-start p-0 h-auto">
                    <LogOut className="h-5 w-5" /> Logout
                </Button>
            </SheetClose>
          </>
        ) : (
            <>
                <SheetClose asChild>
                    <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                         <LogIn className="h-5 w-5" /> Login
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                     <Link href="/register" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <UserPlus className="h-5 w-5" /> Sign Up
                    </Link>
                </SheetClose>
            </>
        )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {!isHomePage && isAdmin && user && <AdminMobileSheet />}

        <Link href="/" className="flex items-center justify-center gap-2 md:mr-6">
          <Logo className="h-10 w-10" />
          <span className="text-lg font-bold font-headline">FZBoostify</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-auto">
          {authLinks}
        </nav>
        
        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 ml-auto md:ml-0 md:hidden">
            <InstallPWA />
            {!isHomePage && (
              <Sheet>
              <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                  </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                  <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                      <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                  </SheetHeader>
                  <nav className="grid gap-6 text-lg font-medium mt-4">
                  {mobileNavLinks}
                  </nav>
              </SheetContent>
              </Sheet>
            )}
        </div>
      </header>
    </>
  );
}

function AdminMobileSheet() {
    return (
         <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Admin Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden p-0">
                 <SheetHeader className="p-4">
                    <SheetTitle>Admin Menu</SheetTitle>
                    <SheetDescription className="sr-only">Administrator navigation menu</SheetDescription>
                </SheetHeader>
                 <AdminSidebar />
            </SheetContent>
        </Sheet>
    )
}

function AdminMobileNav() {
    return (
        <div className="pl-4 border-l-2 border-primary/50 ml-2 space-y-4">
            <SheetClose asChild>
                <Link href="/admin/orders" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-base">
                    <ShoppingCart className="h-5 w-5" /> Orders
                </Link>
            </SheetClose>
            <SheetClose asChild>
                <Link href="/admin/users" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-base">
                    <Users className="h-5 w-5" /> Users
                </Link>
            </SheetClose>
            <SheetClose asChild>
                <Link href="/admin/credentials" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-base">
                    <KeyRound className="h-5 w-5" /> Credentials
                </Link>
            </SheetClose>
             <SheetClose asChild>
                <Link href="/admin/services" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-base">
                    <Settings className="h-5 w-5" /> Services
                </Link>
            </SheetClose>
             <SheetClose asChild>
                <Link href="/admin/comments" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-base">
                    <MessageSquare className="h-5 w-5" /> Customer Comments
                </Link>
            </SheetClose>
        </div>
    )
}
