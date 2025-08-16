
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrders, type Order } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setIsOrdersLoading(true);
    try {
      const userOrders = await getOrders();
      const filteredOrders = userOrders.filter(o => o.userEmail === user.email);
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!isAuthLoading) {
      setIsOrdersLoading(false);
    }
  }, [user, isAuthLoading, fetchOrders]);
  
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


  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [user, isAuthLoading, router]);

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Complete":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  if (isAuthLoading || !user) {
     return (
        <div className="container mx-auto py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <Skeleton className="h-9 w-64" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Available Funds</CardTitle></CardHeader>
                    <CardContent><Skeleton className="h-10 w-48" /></CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Here's a list of your recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
     );
  }

  const maskedPassword = "*".repeat(10);

  return (
    <div className="container mx-auto py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {user.username}!</h1>
        <div className="flex gap-2">
            <Button asChild>
              <Link href="/order"><PlusCircle /> New Order</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/deposit"><ShoppingCart /> Deposit Funds</Link>
            </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Password:</strong> {maskedPassword}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Funds</CardTitle>
            <CardDescription>Your current account balance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">PKR {user.funds.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Here's a list of your recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isOrdersLoading ? (
             <div className="space-y-4">
                <div className="hidden md:block">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="md:hidden grid gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
             </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block">
                  <Table>
                      <TableHeader>
                      <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {orders.map((order) => (
                          <TableRow key={order.id}>
                          <TableCell className="capitalize">{order.platform} - {order.serviceType}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>PKR {order.price.toFixed(2)}</TableCell>
                          <TableCell>
                              <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                  </Table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden grid gap-4">
                  {orders.map((order) => (
                  <Card key={order.id}>
                      <CardHeader>
                          <CardTitle className="text-lg capitalize">{order.platform} - {order.serviceType}</CardTitle>
                          <CardDescription>
                              {new Date(order.createdAt).toLocaleDateString()}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                          <div className="flex justify-between">
                              <span className="font-medium">Status:</span>
                              <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                              <span className="font-medium">Quantity:</span>
                              <span>{order.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="font-medium">Price:</span>
                              <span>PKR {order.price.toFixed(2)}</span>
                          </div>
                      </CardContent>
                  </Card>
                  ))}
              </div>
              {orders.length === 0 && <p className="text-center text-muted-foreground py-4">You haven't placed any orders yet.</p>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
