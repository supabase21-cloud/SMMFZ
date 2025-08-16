import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// This function has been disabled to prevent errors.
// The notification system has been removed from the application.

serve(async (req) => {
  console.log("Order status update notification trigger received, but function is disabled.");
  return new Response(
    JSON.stringify({ message: "Notification function is disabled." }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
