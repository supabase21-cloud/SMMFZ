import type { SVGProps } from "react";
import Image from 'next/image';

export const InstagramLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export const TikTokLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 8.15c-1.3.35-2.6.5-3.9.5-2.8 0-5-2.2-5-5V2h-3v11.5a6.5 6.5 0 1 0 13 0V10c0-1-.8-1.85-1.9-1.85Z"></path>
  </svg>
);

export const YouTubeLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 4.24 4.24 2.5 7 2.5h10c2.76 0 4.5 1.74 4.5 4.5s0 10 0 10a24.12 24.12 0 0 1 0 10c0 2.76-1.74 4.5-4.5 4.5H7c-2.76 0-4.5-1.74-4.5-4.5Z"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

export const Logo = ({ className, ...props }: { className?: string }) => (
    <Image
        src="https://i.postimg.cc/hXXxpK3k/IMG-20250808-WA0265.jpg"
        alt="FZBoostify Logo"
        width={100}
        height={100}
        className={className}
        unoptimized
    />
);
