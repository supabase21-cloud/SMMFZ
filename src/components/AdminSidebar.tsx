
"use client";

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, ShoppingCart, Users, DollarSign, LogOut, Settings, KeyRound, MessageSquare } from 'lucide-react';

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/credentials", icon: KeyRound, label: "Credentials"},
    { href: "/admin/services", icon: Settings, label: "Services" },
    { href: "/admin/comments", icon: MessageSquare, label: "Customer Comments" },
    { href: "/admin/pricing", icon: DollarSign, label: "Pricing" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    return (
        <aside className="hidden md:flex flex-col w-64 bg-card border-r p-4">
            <div className="flex items-center gap-2 mb-8">
                <Logo className="h-10 w-10" />
                <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map(item => (
                    <Button
                        key={item.href}
                        asChild
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="justify-start"
                    >
                        <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Link>
                    </Button>
                ))}
            </nav>
             <Button
                variant="ghost"
                className="justify-start mt-auto"
                onClick={handleLogout}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </aside>
    )
}
