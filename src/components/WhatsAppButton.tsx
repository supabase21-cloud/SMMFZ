"use client";

import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
}

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M18.413 5.587A9.948 9.948 0 0 0 12 2.05C6.494 2.05 2.05 6.494 2.05 12c0 1.84.49 3.562 1.34 5.044L2.05 22l4.956-1.34A9.947 9.947 0 0 0 12 21.95c5.506 0 9.95-4.444 9.95-9.95a9.942 9.942 0 0 0-3.537-6.413zM12 20.354c-1.63 0-3.184-.44-4.542-1.237l-.324-.194-3.37.91.92-3.304-.214-.34A8.34 8.34 0 0 1 3.65 12c0-4.603 3.747-8.35 8.35-8.35s8.35 3.747 8.35 8.35-3.747 8.35-8.35 8.35zm4.49-5.832c-.248-.124-1.46-.72-1.688-.802-.227-.082-.392-.124-.557.124-.164.248-.638.802-.782.966-.144.164-.288.185-.536.062-.248-.124-1.05-.386-2-1.23-.738-.655-1.23-1.47-1.374-1.717-.144-.248-.012-.38.11-.504.11-.11.248-.287.372-.43.124-.144.164-.248.248-.412.082-.164.04-.308-.02-.43-.06-.124-.557-1.34-.76-1.83-.2-.49-.408-.42-.557-.426-.144-.006-.308-.006-.472-.006a.89.89 0 0 0-.64.308c-.204.248-.78 1.15-1 2.29-.22 1.14.78 2.37 1.5 3.16 1 1 2.1 2.1 4.2 3.5 2.1 1.4 2.1 1.2 2.5 1.1.4-.1.4-.1.4-.1l.1-.1c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.1-.1c.1 0 .2-.1.2-.1l.1-.1c0 0 .1 0 .1-.1h.1c.1 0 .1-.1.1-.1l.1-.1c.1 0 .1 0 .1-.1l.1-.1c.2-.2.3-.3.4-.5.1-.2.2-.4.2-.5 0-.1.1-.2.1-.3v-.1c-.083-.164-.165-.247-.248-.371z"
      clipRule="evenodd"
    />
  </svg>
);

export function WhatsAppButton({ phoneNumber, message }: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#1EBE56] shadow-lg z-50"
    >
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </Button>
  );
}
