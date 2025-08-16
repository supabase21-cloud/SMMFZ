
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getServices, addService, updateService, updateServiceAvailability, deleteService, type Service } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Edit, Check, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type ServiceEntry = Omit<Service, 'id' | 'available' | 'platform'>;
const SESSION_STORAGE_KEY = 'adminServiceFormState';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [platform, setPlatform] = useState('');
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([{ type: '', price: 0, min: 500, max: 10000, user_cooldown_hours: 1, link_cooldown_hours: 24 }]);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  
  const [isPlatformPopoverOpen, setIsPlatformPopoverOpen] = useState(false);

  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    if (isDialogOpen || isDeleteDialogOpen) return;
    
    setIsLoading(true);
    
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setIsLoading(false);
    }
  }, [isDialogOpen, isDeleteDialogOpen]);


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


  const existingPlatforms = useMemo(() => {
    const platformNames = services.map(s => s.platform);
    return [...new Set(platformNames)].map(p => ({ value: p.toLowerCase(), label: p }));
  }, [services]);

  const resetDialogState = () => {
    setPlatform('');
    setServiceEntries([{ type: '', price: 0, min: 500, max: 10000, user_cooldown_hours: 1, link_cooldown_hours: 24 }]);
    setEditingService(null);
    setIsEditMode(false);
  };
  
  const handleDialogChange = (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
          resetDialogState();
      }
  }

  const handleOpenAddDialog = () => {
    resetDialogState();
    setIsEditMode(false);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (service: Service) => {
    resetDialogState();
    setEditingService(service);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleAddServiceEntry = () => {
    const newEntries = [...serviceEntries, { type: '', price: 0, min: 500, max: 10000, user_cooldown_hours: 1, link_cooldown_hours: 24 }];
    setServiceEntries(newEntries);
  };

  const handleRemoveServiceEntry = (index: number) => {
    const newEntries = serviceEntries.filter((_, i) => i !== index);
    setServiceEntries(newEntries);
  };
  
  const handlePlatformChange = (value: string) => {
      setPlatform(value);
      setIsPlatformPopoverOpen(false);
  };

  const handleServiceEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEntries = [...serviceEntries];
    const entry = newEntries[index];
    const numValue = value === '' ? '' : parseFloat(value);
    (entry as any)[name] = (name === 'price' || name === 'min' || name === 'max' || name === 'user_cooldown_hours' || name === 'link_cooldown_hours') 
        ? numValue
        : value;
    setServiceEntries(newEntries);
  };

  const handleEditServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingService) return;
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseFloat(value);
    const updatedValue = (name === 'price' || name === 'min' || name === 'max' || name === 'user_cooldown_hours' || name === 'link_cooldown_hours')
        ? numValue
        : value;
    const updatedService = { ...editingService, [name]: updatedValue };
    setEditingService(updatedService);
  };


  const handleSave = async () => {
    if (isEditMode) {
      if (!editingService || !editingService.id) return;
      const result = await updateService(editingService.id, editingService as Omit<Service, 'id' | 'available'>);
      if (result) {
        toast({ title: "Success", description: "Service updated successfully." });
        await fetchServices();
        handleDialogChange(false);
      } else {
        toast({ title: "Error", description: "Failed to update the service.", variant: "destructive" });
      }
    } else {
      if (!platform || serviceEntries.some(s => !s.type || s.price < 0)) {
        toast({ title: "Invalid Input", description: "Please fill in all platform and service details correctly. Price cannot be negative.", variant: "destructive" });
        return;
      }
      const newServices = serviceEntries.map(entry => ({
        platform,
        ...entry,
        price: typeof entry.price === 'string' ? 0 : entry.price, // Ensure price is a number
      }));
      const result = await addService(newServices as any);
      if (result) {
        toast({ title: "Success", description: `${newServices.length} service(s) added successfully.` });
        await fetchServices();
        handleDialogChange(false);
      } else {
        toast({ title: "Error", description: "Failed to save the services.", variant: "destructive" });
      }
    }
  };

  const handleAvailabilityChange = async (serviceId: string, available: boolean) => {
    const originalServices = [...services];
    const updatedServices = services.map(s => s.id === serviceId ? {...s, available} : s);
    setServices(updatedServices);

    const result = await updateServiceAvailability(serviceId, available);
    if (!result) {
      setServices(originalServices);
       toast({
        title: "Error",
        description: "Failed to update service availability.",
        variant: "destructive",
      });
    } else {
         toast({
            title: "Success",
            description: "Service availability updated."
        })
    }
  }

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    const result = await deleteService(serviceToDelete.id);
    if (result.success) {
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted.",
      });
      await fetchServices();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete the service.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
  };


  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Service(s)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Service" : "Add New Service(s)"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Update the details for this service." : "Add one or more service types for a single platform."}
              </DialogDescription>
            </DialogHeader>
            
            {isEditMode && editingService ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">Platform</Label>
                  <Input id="platform" name="platform" value={editingService.platform || ''} onChange={handleEditServiceChange} className="col-span-3 capitalize" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Input id="type" name="type" value={editingService.type || ''} onChange={handleEditServiceChange} className="col-span-3 capitalize" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price (per unit)</Label>
                  <Input id="price" name="price" type="number" value={editingService.price ?? ''} onChange={handleEditServiceChange} className="col-span-3" step="any" min="0" />
                </div>
                 {editingService.price === 0 && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user_cooldown_hours" className="text-right">User Cooldown (Hours)</Label>
                        <Input id="user_cooldown_hours" name="user_cooldown_hours" type="number" value={editingService.user_cooldown_hours ?? ''} onChange={handleEditServiceChange} className="col-span-3" min="0" placeholder="0 for no limit"/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link_cooldown_hours" className="text-right">Link Cooldown (Hours)</Label>
                        <Input id="link_cooldown_hours" name="link_cooldown_hours" type="number" value={editingService.link_cooldown_hours ?? ''} onChange={handleEditServiceChange} className="col-span-3" min="0" placeholder="0 for no limit"/>
                    </div>
                  </>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min" className="text-right">Min Order</Label>
                  <Input id="min" name="min" type="number" value={editingService.min ?? ''} onChange={handleEditServiceChange} className="col-span-3" min="0" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max" className="text-right">Max Order</Label>
                  <Input id="max" name="max" type="number" value={editingService.max ?? ''} onChange={handleEditServiceChange} className="col-span-3" min="0" />
                </div>
              </div>
            ) : (
               <div className="grid gap-6 py-4">
                <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Popover open={isPlatformPopoverOpen} onOpenChange={setIsPlatformPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isPlatformPopoverOpen}
                                className="w-full justify-between capitalize"
                            >
                                {platform ? existingPlatforms.find(p => p.value === platform.toLowerCase())?.label || platform : "Select or create platform..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput 
                                    placeholder="Search platform or add new..."
                                    value={platform}
                                    onValueChange={setPlatform}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        <div className="p-4 text-sm text-center">
                                            No platform found. <br/>
                                            Type to create a new one.
                                        </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {existingPlatforms.map((p) => (
                                        <CommandItem
                                            key={p.value}
                                            value={p.value}
                                            onSelect={handlePlatformChange}
                                            className="capitalize"
                                        >
                                            <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                platform.toLowerCase() === p.value ? "opacity-100" : "opacity-0"
                                            )}
                                            />
                                            {p.label}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-4">
                    {serviceEntries.map((entry, index) => (
                        <Card key={index} className="p-4 space-y-4 relative">
                           {serviceEntries.length > 1 && (
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveServiceEntry(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                           )}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`type-${index}`}>Service Type</Label>
                                    <Input id={`type-${index}`} name="type" value={entry.type} onChange={(e) => handleServiceEntryChange(index, e)} placeholder="e.g., followers" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`price-${index}`}>Price (per unit)</Label>
                                    <Input id={`price-${index}`} name="price" type="number" value={entry.price} onChange={(e) => handleServiceEntryChange(index, e)} step="any" min="0" />
                                </div>
                           </div>
                           {entry.price === 0 && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-md">
                                <div className="space-y-2">
                                    <Label htmlFor={`user_cooldown_hours-${index}`} className="text-sm">User Cooldown (Hours)</Label>
                                    <Input id={`user_cooldown_hours-${index}`} name="user_cooldown_hours" type="number" value={entry.user_cooldown_hours} onChange={(e) => handleServiceEntryChange(index, e)} min="0" placeholder="0 for no limit"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`link_cooldown_hours-${index}`} className="text-sm">Link Cooldown (Hours)</Label>
                                    <Input id={`link_cooldown_hours-${index}`} name="link_cooldown_hours" type="number" value={entry.link_cooldown_hours} onChange={(e) => handleServiceEntryChange(index, e)} min="0" placeholder="0 for no limit"/>
                                </div>
                            </div>
                           )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor={`min-${index}`}>Min Order</Label>
                                    <Input id={`min-${index}`} name="min" type="number" value={entry.min} onChange={(e) => handleServiceEntryChange(index, e)} min="0"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`max-${index}`}>Max Order</Label>
                                    <Input id={`max-${index}`} name="max" type="number" value={entry.max} onChange={(e) => handleServiceEntryChange(index, e)} min="0"/>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Button variant="outline" onClick={handleAddServiceEntry}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Service Type
                </Button>
            </div>
            )}
           
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price (per unit)</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="capitalize">{service.platform}</TableCell>
                        <TableCell className="capitalize">{service.type}</TableCell>
                        <TableCell>PKR {service.price.toFixed(4)}</TableCell>
                        <TableCell>{service.min} - {service.max}</TableCell>
                        <TableCell>
                          <Switch
                            checked={service.available}
                            onCheckedChange={(checked) => handleAvailabilityChange(service.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenEditDialog(service)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleOpenDeleteDialog(service)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="md:hidden grid gap-4">
            {services.map((service) => (
                <Card key={service.id}>
                    <CardHeader>
                        <CardTitle className="text-lg capitalize flex justify-between items-center">
                            {service.platform} - {service.type}
                            <Switch
                                checked={service.available}
                                onCheckedChange={(checked) => handleAvailabilityChange(service.id, checked)}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Price (per unit):</span>
                            <span>PKR {service.price.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Order Range:</span>
                            <span>{service.min} - {service.max}</span>
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Button variant="outline" className="w-full" onClick={() => handleOpenEditDialog(service)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                             <Button variant="destructive" className="w-full" onClick={() => handleOpenDeleteDialog(service)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>
           {services.length === 0 && !isLoading && <p className="text-center text-muted-foreground py-4">No services created yet.</p>}
        </>
      )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the 
                    <span className="font-bold capitalize"> {serviceToDelete?.platform} - {serviceToDelete?.type} </span> 
                    service.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setServiceToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteService} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}
