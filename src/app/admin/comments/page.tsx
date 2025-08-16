
"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus, type Order } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerCommentsPage() {
  const [commentOrders, setCommentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const { toast } = useToast();

  const fetchCommentOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const allOrders = await getOrders();
      const filteredOrders = allOrders.filter(
        (order) => Array.isArray(order.comments) && order.comments.length > 0 && order.status === 'Pending'
      );
      setCommentOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch comment orders", error);
      toast({
        title: "Error",
        description: "Could not fetch comments from the database.",
        variant: "destructive"
      });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCommentOrders();
  }, [fetchCommentOrders]);

  // Refetch data when tab becomes visible
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

  const copyToClipboard = (text: string, entity: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${entity} copied to clipboard.`,
    });
  };

  const handleCancelClick = (order: Order) => {
    setOrderToCancel(order);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(orderToCancel.id);
    const result = await updateOrderStatus(orderToCancel.id, 'Cancelled');
    if (result) {
      toast({
        title: "Order Cancelled",
        description: "The order has been cancelled and funds returned to the user.",
      });
      setCommentOrders(prev => prev.filter(o => o.id !== orderToCancel.id));
    } else {
       toast({
        title: "Error",
        description: "Failed to cancel the order.",
        variant: "destructive",
      });
    }
    setOrderToCancel(null);
    setIsCancelling(null);
  };


  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Comments</h1>
          <p className="text-muted-foreground">Review and manage pending orders with custom comments.</p>
        </div>
        <Button onClick={() => fetchCommentOrders()} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : commentOrders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No pending orders with comments found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {commentOrders.map((order) => (
            <Card key={order.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{order.username}</CardTitle>
                <CardDescription>
                  Order placed on: {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="space-y-1">
                  <span className="font-medium text-sm">Link:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={order.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm break-all"
                    >
                      {order.link}
                    </a>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard(order.link, "Link")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Comments ({order.comments?.length}):</span>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(order.comments!.join('\n'), "Comments")}>
                      <Copy className="mr-2 h-3 w-3" />
                      Copy All
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-md max-h-48 overflow-y-auto">
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {order.comments?.map((comment, i) => (
                        <li key={i}>{comment}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelClick(order)}
                    disabled={!!isCancelling}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isCancelling === order.id ? "Cancelling..." : "Cancel Order"}
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the order and refund <span className="font-bold">PKR {orderToCancel?.price.toFixed(2)}</span> to <span className="font-bold">{orderToCancel?.username}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-destructive hover:bg-destructive/90">
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
