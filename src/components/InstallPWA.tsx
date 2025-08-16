
"use client";

import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const InstallPWA = () => {
  const { installPrompt, handleInstall } = useInstallPrompt();

  if (!installPrompt) {
     return (
        <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Install App
        </Button>
     )
  }

  return (
    <Button variant="outline" onClick={handleInstall}>
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
};

export default InstallPWA;
