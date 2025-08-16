
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getServices, placeOrder, type Service, PlaceOrderResult } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

function CooldownTimer({ expiry, messageTemplate }: { expiry: number, messageTemplate: string }) {
    const [timeLeft, setTimeLeft] = useState(expiry - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = expiry - Date.now();
            if (newTimeLeft <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiry]);

    if (timeLeft <= 0) {
        return "You can now place another free order.";
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return messageTemplate
        .replace('{h}', String(hours))
        .replace('{m}', String(minutes))
        .replace('{s}', String(seconds));
}

export default function OrderPage() {
    const { user, refreshUser, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [services, setServices] = useState<Service[]>([]);
    const [isServicesLoading, setIsServicesLoading] = useState(true);

    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [link, setLink] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- State Persistence with sessionStorage ---
    useEffect(() => {
        // Load state from sessionStorage on component mount
        const savedState = sessionStorage.getItem('orderFormState');
        if (savedState) {
            try {
                const { platform, serviceId, qty, formLink, formComments } = JSON.parse(savedState);
                if (platform) setSelectedPlatform(platform);
                if (serviceId) setSelectedServiceId(serviceId);
                if (qty) setQuantity(qty);
                if (formLink) setLink(formLink);
                if (formComments) setComments(formComments);
            } catch(e) {
                console.error("Failed to parse order form state from session storage", e);
                sessionStorage.removeItem('orderFormState');
            }
        }
    }, []);

    const saveStateToSession = (newState: any) => {
        const currentState = JSON.parse(sessionStorage.getItem('orderFormState') || '{}');
        const updatedState = { ...currentState, ...newState };
        sessionStorage.setItem('orderFormState', JSON.stringify(updatedState));
    };
    
    // --- End State Persistence ---

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.replace('/login');
        }
    }, [user, isAuthLoading, router]);

    const fetchServices = useCallback(async () => {
        setIsServicesLoading(true);
        try {
            const availableServices = await getServices();
            setServices(availableServices.filter(s => s.available));
        } catch(e) {
            console.error(e);
        } finally {
            setIsServicesLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

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

    const isCommentService = useMemo(() => {
        return selectedService?.type.toLowerCase().includes('comment');
    }, [selectedService]);

    useEffect(() => {
        if (isCommentService) {
            const lines = comments.split('\n').filter(line => line.trim() !== '');
            const newQuantity = lines.length;
            setQuantity(newQuantity);
            saveStateToSession({ qty: newQuantity });
        }
    }, [comments, isCommentService]);


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
        setComments('');
        setLink('');
        saveStateToSession({ platform, serviceId: '', qty: '', formLink: '', formComments: '' });
    }

    const handleServiceChange = (serviceId: string) => {
        setSelectedServiceId(serviceId);
        const service = services.find(s => s.id === serviceId);
        if (service) {
            if (!service.type.toLowerCase().includes('comment')) {
                setQuantity(service.min);
                saveStateToSession({ serviceId, qty: service.min, formComments: '' });
            } else {
                setQuantity(0);
                saveStateToSession({ serviceId, qty: 0 });
            }
             setComments('');
        } else {
            saveStateToSession({ serviceId, qty: '', formComments: '' });
        }
    }
    
    const handleQuantityChange = (value: string) => {
        const numValue = value === '' ? '' : Number(value);
        setQuantity(numValue);
        saveStateToSession({ qty: numValue });
    }
    
    const handleLinkChange = (value: string) => {
        setLink(value);
        saveStateToSession({ formLink: value });
    }

    const handleCommentsChange = (value: string) => {
        setComments(value);
        saveStateToSession({ formComments: value });
    }


    const isValidUrl = (urlString: string): boolean => {
        try {
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
        if (!selectedService || !user || typeof quantity !== 'number' || !link) {
            toast({
                title: "Invalid Input",
                description: "Please fill all fields correctly.",
                variant: "destructive"
            });
            return;
        }

        if (quantity <= 0) {
             toast({
                title: "Invalid Input",
                description: "Quantity must be greater than zero.",
                variant: "destructive"
            });
            return;
        }

        const commentArray = isCommentService ? comments.split('\n').filter(line => line.trim() !== '') : undefined;

        if (isCommentService && (!commentArray || commentArray.length === 0)) {
            toast({
                title: "Invalid Input",
                description: "Please enter your custom comments.",
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

        if (!isCommentService && (quantity < selectedService.min || quantity > selectedService.max)) {
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
            comments: commentArray,
        };
        
        // Remove comments field explicitly to fix the bug
        delete (orderData as any).comments;

        const result: PlaceOrderResult = await placeOrder(orderData);

        setIsSubmitting(false);

        if (result.success && result.order) {
            sessionStorage.removeItem('orderFormState'); // Clear session state on success
            toast({
                title: "Order Placed!",
                description: "Your order has been placed successfully."
            });
            await refreshUser();
            router.push('/dashboard');
        } else {
             if (result.errorType === 'LINK_COOLDOWN' && result.cooldownExpiry) {
                toast({
                    title: "Free Service Limit",
                    description: <CooldownTimer 
                                    expiry={result.cooldownExpiry} 
                                    messageTemplate="You can use this free service for this link again in {h}h {m}m {s}s." 
                                 />,
                    variant: "destructive",
                    duration: result.cooldownExpiry - Date.now(),
                });
            } else if (result.errorType === 'USER_COOLDOWN' && result.cooldownExpiry) {
                 toast({
                    title: "Free Service Limit",
                    description: <CooldownTimer 
                                    expiry={result.cooldownExpiry} 
                                    messageTemplate="You can use another free service in {h}h {m}m {s}s." 
                                 />,
                    variant: "destructive",
                    duration: result.cooldownExpiry - Date.now(),
                });
            }
            else {
                toast({
                    title: "Order Failed",
                    description: result.error || "There was an issue placing your order. Please try again.",
                    variant: "destructive"
                });
            }
        }
    };
    
    if (isAuthLoading || !user) {
        return (
            <div className="container mx-auto py-8 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                             <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                         </div>
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            </div>
        ); 
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
                        {isServicesLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                            </div>
                        ) : (
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
                        )}

                        {selectedService && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="link">Link</Label>
                                    <Input 
                                        id="link" 
                                        placeholder="e.g., https://www.instagram.com/p/C..."
                                        value={link}
                                        onChange={(e) => handleLinkChange(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {isCommentService && (
                                    <div className="space-y-2">
                                        <Label htmlFor="comments">Type Custom Comments (1 per line)</Label>
                                        <Textarea
                                            id="comments"
                                            placeholder="Enter each comment on a new line."
                                            value={comments}
                                            onChange={(e) => handleCommentsChange(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            rows={5}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input 
                                        id="quantity" 
                                        type="number" 
                                        placeholder={!isCommentService ? `Min: ${selectedService.min}, Max: ${selectedService.max}` : ''}
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        min={!isCommentService ? selectedService.min : 0}
                                        max={!isCommentService ? selectedService.max : undefined}
                                        required
                                        disabled={isSubmitting || isCommentService}
                                        readOnly={isCommentService}
                                    />
                                    {!isCommentService && (
                                        <p className="text-sm text-muted-foreground">
                                            Min: {selectedService.min} / Max: {selectedService.max}
                                        </p>
                                    )}
                                     {isCommentService && (
                                        <p className="text-sm text-muted-foreground">
                                            Quantity is determined by the number of lines in your comments. Price per comment: PKR {selectedService.price.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Total Price:</span>
                                            <span className="text-xl font-bold text-primary">PKR {totalPrice.toFixed(2)}</span>
                                        </div>
                                         <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                                            <span>Your current balance:</span>
                                            <span>PKR {user.funds.toFixed(2)}</span>
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
