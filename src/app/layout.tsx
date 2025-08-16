import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

// IMPORTANT: Replace this URL with the new link provided by the user.
const FZ_LOGO_URL = "https://i.postimg.cc/3NdjMfbD/Screenshot-20250809-021244-2.jpg";

export const metadata: Metadata = {
  title: "FZBoostify",
  description: "Elevate your social media presence with FZBoostify.",
  icons: {
    icon: FZ_LOGO_URL,
    shortcut: FZ_LOGO_URL,
    apple: FZ_LOGO_URL,
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: FZ_LOGO_URL,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fd5f0e" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7D1QFF49RJ"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7D1QFF49RJ');
          `}
        </Script>
      </head>
      <body
        className={`${poppins.variable} ${ptSans.variable} font-body antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
