
"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus, type Order } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const copyToClipboard = (text: string, entity: string = "Link") => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied!",
        description: `${entity} copied to clipboard.`,
    });
  };

  const handleStatusUpdate = async (orderId: string, status: "Complete" | "Cancelled") => {
    const originalOrders = [...orders];
    const updatedOrders = orders.map(o => o.id === orderId ? {...o, status: status} : o);
    setOrders(updatedOrders);

    const result = await updateOrderStatus(orderId, status);
    if (!result) {
      setOrders(originalOrders);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } else {
        toast({
            title: "Success",
            description: `Order marked as ${status}.`
        })
    }
  };

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
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

        {isLoading ? (
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="hidden md:block">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="md:hidden grid gap-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                </CardContent>
            </Card>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.username}</TableCell>
                          <TableCell className="capitalize">{order.platform} - {order.serviceType}</TableCell>
                          <TableCell className="max-w-xs">
                             <div className="flex items-center gap-2">
                              <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                                  {order.link}
                              </a>
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard(order.link, "Link")}>
                                  <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>PKR {order.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {order.status === 'Pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'Complete')}>Complete</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Cancel</Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Mobile View */}
            <div className="md:hidden grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{order.platform} - {order.serviceType}</CardTitle>
                    <CardDescription>
                      {order.username} - {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                    <div className="space-y-1">
                      <span className="font-medium">Link:</span>
                      <div className="flex items-center gap-2">
                          <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">
                              {order.link}
                          </a>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard(order.link)}>
                              <Copy className="h-4 w-4" />
                          </Button>
                      </div>
                    </div>
                    {order.status === 'Pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1" onClick={() => handleStatusUpdate(order.id, 'Complete')}>Complete</Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Cancel</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {orders.length === 0 && <p className="text-center text-muted-foreground py-4">There are no orders to display.</p>}
          </>
        )}
    </div>
  );
}
