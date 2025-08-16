
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// This function has been temporarily disabled to remove credentials from the git history.
// It can be re-enabled later using secure environment variables for secrets.

serve(async (_req) => {
  console.log("New order notification trigger received, but function is disabled to protect secrets.");
  return new Response(
    JSON.stringify({ message: "Notification function is currently disabled." }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
