
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstagramLogo, TikTokLogo, YouTubeLogo } from "@/components/Icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Image from "next/image";
import { Header } from "@/components/Header";

export default function Home() {

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

  const services = [
    {
      name: "Instagram",
      icon: <InstagramLogo className="h-12 w-12 text-primary" />,
      description: "Boost your presence with high-quality followers and likes.",
      image: "https://placehold.co/600x400.png",
      aiHint: "social media growth"
    },
    {
      name: "TikTok",
      icon: <TikTokLogo className="h-12 w-12 text-primary" />,
      description: "Go viral with our tailored TikTok engagement services.",
      image: "https://placehold.co/600x400.png",
      aiHint: "influencer content"
    },
    {
      name: "YouTube",
      icon: <YouTubeLogo className="h-12 w-12 text-primary" />,
      description: "Grow your channel with real subscribers and views.",
      image: "https://placehold.co/600x400.png",
      aiHint: "video production"
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Elevate Your Social Media Presence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    FZBoostify provides top-tier services to grow your
                    Instagram, TikTok, and YouTube accounts safely and
                    effectively.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                    <Link href="/register">Register</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8U29jaWFsfGVufDB8fHx8MTc1NDY1MzYxMHww&ixlib=rb-4.1.0&q=80&w=1080"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="social media interface"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Our Services
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                  Services to Fuel Your Growth
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our social boost service helps you increase your followers, likes, and engagement. We provide real, high-quality interactions to help you grow your audience and enhance your online presence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {services.map((service) => (
                <Card key={service.name} className="h-full">
                  <CardHeader className="items-center">
                    {service.icon}
                    <CardTitle className="mt-4">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton 
          phoneNumber="923138697887"
          message="I need some information about your services."
        />
    </div>
  );
}
