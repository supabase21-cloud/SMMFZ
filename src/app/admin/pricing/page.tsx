"use client";

import { useEffect, useState } from "react";
import { getPrices, updatePrices, ServicePrices } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function PricingPage() {
  const [prices, setPrices] = useState<ServicePrices>({
    instagram: { followers: 0, likes: 0 },
    tiktok: { followers: 0, likes: 0 },
    youtube: { followers: 0, likes: 0 },
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchedPrices = getPrices();
    setPrices(fetchedPrices);
  }, []);

  const handlePriceChange = (platform: keyof ServicePrices, service: string, value: string) => {
    const newPrice = parseFloat(value) || 0;
    setPrices(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [service]: newPrice,
      }
    }));
  };

  const handleSave = () => {
    updatePrices(prices);
    toast({
      title: "Prices Updated",
      description: "The new prices have been saved.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
            <CardTitle className="text-3xl font-bold">Manage Prices</CardTitle>
            <CardDescription>
                Note: This page is deprecated. Prices are now managed per-service on the Services page.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.keys(prices).map(platform => (
              <div key={platform} className="space-y-4">
                <h2 className="text-2xl font-semibold capitalize">{platform}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(prices[platform as keyof ServicePrices]).map(service => (
                    <div key={service} className="space-y-2">
                      <Label htmlFor={`${platform}-${service}`} className="capitalize">
                        {service} Price (per 1000)
                      </Label>
                      <Input
                        id={`${platform}-${service}`}
                        type="number"
                        value={prices[platform as keyof ServicePrices][service]}
                        onChange={(e) => handlePriceChange(platform as keyof ServicePrices, service, e.target.value)}
                        step="0.01"
                        disabled
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button onClick={handleSave} disabled>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
