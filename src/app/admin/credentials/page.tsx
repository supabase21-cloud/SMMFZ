
"use client";

import { useEffect, useState, useCallback } from "react";
import { getUsers, type User } from "@/lib/data";
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
import { Input } from "@/components/ui/input";

export default function AdminCredentialsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
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


  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Credentials</h1>
          <p className="text-muted-foreground">View user emails and their corresponding User ID.</p>
        </div>
        <Input
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>User ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="font-mono bg-muted px-2 py-1 rounded">{user.id}</span>
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
                    <CardTitle className="text-lg">{user.email}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm font-medium">User ID:</p>
                    <p className="font-mono bg-muted px-2 py-1 rounded-md text-sm break-all">{user.id}</p>
                </CardContent>
              </Card>
            ))}
          </div>

           {filteredUsers.length === 0 && !loading && (
             <Card className="mt-4">
                <CardContent className="p-6 text-center text-muted-foreground">
                    No users found for your search query.
                </CardContent>
             </Card>
           )}
        </>
    </div>
  );
}
