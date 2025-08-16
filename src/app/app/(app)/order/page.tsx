
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getServices, placeOrder, type Service } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function OrderPage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [services, setServices] = useState<Service[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.replace('/dashboard');
        }
    }, [user, router]);

    const fetchServices = useCallback(async () => {
        const availableServices = await getServices();
        setServices(availableServices.filter(s => s.available));
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Re-fetch data when the tab becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            fetchServices();
        }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchServices]);

    const availablePlatforms = useMemo(() => {
        const platforms = services.map(s => s.platform);
        return [...new Set(platforms)];
    }, [services]);

    const availableServicesForPlatform = useMemo(() => {
        if (!selectedPlatform) return [];
        return services.filter(s => s.platform === selectedPlatform);
    }, [services, selectedPlatform]);

    const selectedService = useMemo(() => {
        return services.find(s => s.id === selectedServiceId);
    }, [services, selectedServiceId]);

    const totalPrice = useMemo(() => {
        if (selectedService && typeof quantity === 'number' && quantity > 0) {
            return (quantity * selectedService.price);
        }
        return 0;
    }, [selectedService, quantity]);
    
    const handlePlatformChange = (platform: string) => {
        setSelectedPlatform(platform);
        setSelectedServiceId('');
        setQuantity('');
    }

    const handleServiceChange = (serviceId: string) => {
        setSelectedServiceId(serviceId);
        const service = services.find(s => s.id === serviceId);
        if (service) {
            setQuantity(service.min);
        }
    }

    const isValidUrl = (urlString: string): boolean => {
        try {
            // Updated regex for better validation
            const pattern = new RegExp('^(https?:\/\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(urlString);
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService || !user || typeof quantity !== 'number' || quantity <= 0 || !link) {
            toast({
                title: "Invalid Input",
                description: "Please fill all fields correctly.",
                variant: "destructive"
            });
            return;
        }

        if (!isValidUrl(link)) {
            toast({
                title: "Invalid Link",
                description: "Please provide a valid link.",
                variant: "destructive"
            });
            return;
        }

        if (quantity < selectedService.min || quantity > selectedService.max) {
             toast({
                title: "Invalid Quantity",
                description: `Quantity must be between ${selectedService.min} and ${selectedService.max}.`,
                variant: "destructive"
            });
            return;
        }

        if (user.funds < totalPrice) {
             toast({
                title: "Insufficient Funds",
                description: "You do not have enough funds to place this order.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            userEmail: user.email,
            serviceId: selectedService.id,
            quantity: quantity,
            link: link,
        };

        const result = await placeOrder(orderData);

        setIsSubmitting(false);

        if (result) {
            toast({
                title: "Order Placed!",
                description: "Your order has been placed successfully."
            });
            await refreshUser();
            router.push('/dashboard');
        } else {
            toast({
                title: "Order Failed",
                description: "There was an issue placing your order. Please try again.",
                variant: "destructive"
            });
        }
    };
    
    if (!user) {
        return null; 
    }

    return (
        <div className="container mx-auto py-8 flex justify-center">
            <Card className="w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Place a New Order</CardTitle>
                        <CardDescription>Select a service and enter the details below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Select onValueChange={handlePlatformChange} value={selectedPlatform}>
                                    <SelectTrigger id="platform">
                                        <SelectValue placeholder="Select a platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePlatforms.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service">Service</Label>
                                <Select onValueChange={handleServiceChange} value={selectedServiceId} disabled={!selectedPlatform}>
                                    <SelectTrigger id="service">
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableServicesForPlatform.map(s => <SelectItem key={s.id} value={s.id} className="capitalize">{s.type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedService && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="link">Link</Label>
                                    <Input 
                                        id="link" 
                                        placeholder="e.g., https://www.instagram.com/p/C..."
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input 
                                        id="quantity" 
                                        type="number" 
                                        placeholder={`Min: ${selectedService.min}, Max: ${selectedService.max}`}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                                        min={selectedService.min}
                                        max={selectedService.max}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Min: {selectedService.min} / Max: {selectedService.max}
                                    </p>
                                </div>
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Total Price:</span>
                                            <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                                        </div>
                                         <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                                            <span>Your current balance:</span>
                                            <span>${user.funds.toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={!selectedService || isSubmitting || !link || !quantity}>
                            Place Order
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
