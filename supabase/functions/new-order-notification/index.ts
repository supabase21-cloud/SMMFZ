// This Supabase Edge Function is currently disabled.
// To enable order notifications for the admin, this function needs to be implemented.
// It should:
// 1. Be triggered when a new row is inserted into the 'orders' table.
// 2. Fetch the admin user's FCM token from the 'users' table.
// 3. Use the Firebase Admin SDK or a similar service to send a push notification to that token.
// 4. Securely handle the Firebase service account credentials.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  console.log("New order notification trigger received, but function is disabled.");
  return new Response(
    JSON.stringify({ message: "Notification function is disabled and needs to be implemented." }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
