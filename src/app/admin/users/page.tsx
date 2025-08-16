
"use client";

import { useEffect, useState, useCallback } from "react";
import { getUsers, setUserFunds, type User } from "@/lib/data";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [operation, setOperation] = useState<"add" | "deduct">("add");
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
        console.error("Failed to fetch users", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const openFundDialog = (user: User, op: "add" | "deduct") => {
    setSelectedUser(user);
    setOperation(op);
    setAmount(0);
    setIsDialogOpen(true);
  };

  const handleFundsUpdate = async () => {
    if (!selectedUser || amount <= 0) {
        toast({
            title: "Invalid Amount",
            description: "Please enter a positive amount.",
            variant: "destructive",
        });
        return;
    };
    
    const originalUsers = [...users];
    const newBalance = operation === 'add' 
        ? selectedUser.funds + amount 
        : selectedUser.funds - amount;
    
    if (newBalance < 0) {
        toast({
            title: "Insufficient Funds",
            description: `Cannot deduct PKR ${amount}. User's balance is only PKR ${selectedUser.funds.toFixed(2)}.`,
            variant: "destructive",
        });
        return;
    }

    // Optimistic update
    const updatedUsers = users.map(u => u.id === selectedUser.id ? { ...u, funds: newBalance } : u);
    setUsers(updatedUsers);

    const result = await setUserFunds(selectedUser.email, newBalance);

    if (result) {
      toast({
        title: "Success",
        description: `Funds updated for ${selectedUser.username}. New balance: PKR ${result.funds.toFixed(2)}`,
      });
      fetchUsers(); // Re-fetch to be sure
    } else {
      setUsers(originalUsers); // Revert on failure
      toast({
        title: "Error",
        description: "Failed to update funds.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold">Users</h1>
             <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
        </div>
      
        {isLoading ? (
             <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="hidden md:block">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="md:hidden grid gap-4">
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
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
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Funds</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>PKR {user.funds.toFixed(2)}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="sm" onClick={() => openFundDialog(user, 'add')}>
                              Add Funds
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => openFundDialog(user, 'deduct')}>
                              Deduct Funds
                            </Button>
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
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                      <CardTitle className="text-lg">{user.username}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                          <span className="font-medium">Funds:</span>
                          <span className="font-bold text-lg">PKR {user.funds.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => openFundDialog(user, 'add')}>
                              Add Funds
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1" onClick={() => openFundDialog(user, 'deduct')}>
                              Deduct Funds
                          </Button>
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredUsers.length === 0 && (
              <Card className="mt-4">
                  <CardContent className="p-6 text-center text-muted-foreground">
                      No users found for your search query.
                  </CardContent>
              </Card>
            )}
          </>
        )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{operation} Funds for {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Current Balance: PKR {selectedUser?.funds.toFixed(2)}</p>
            <Label htmlFor="amount" className="mt-4 block">Amount to {operation}</Label>
            <Input
              id="amount"
              type="number"
              value={amount <= 0 ? "" : amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="mt-2"
              min="0.01"
              step="0.01"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleFundsUpdate}>Update Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
