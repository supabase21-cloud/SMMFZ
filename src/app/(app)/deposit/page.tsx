
"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DepositPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

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

    if (!user) {
        return null;
    }

    const easypaisaDetails = {
        name: "FABEEHAA",
        accountNumber: "03138697887",
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${field} copied to clipboard.`,
        });
    };

    return (
        <div className="container mx-auto py-8 px-4">
             <div className="mx-auto w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl">Deposit Funds</CardTitle>
                        <CardDescription>
                            Follow the instructions below to add funds to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Instructions:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                <li>Transfer funds using the Easypaisa details below.</li>
                                <li>After payment, contact us on WhatsApp with a screenshot of the transaction.</li>
                                <li>Funds will be added to your account within 1 hour.</li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="text-xl">Easypaisa Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                     <div className="flex items-center justify-between">
                                        <p><strong>Account Name:</strong> {easypaisaDetails.name}</p>
                                         <Button variant="ghost" size="icon" onClick={() => copyToClipboard(easypaisaDetails.name, 'Account Name')}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                     </div>
                                      <div className="flex items-center justify-between">
                                        <p><strong>Account Number:</strong> {easypaisaDetails.accountNumber}</p>
                                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(easypaisaDetails.accountNumber, 'Account Number')}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
