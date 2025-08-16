
'use server';

/**
 * @fileOverview A flow for sending push notifications for new orders.
 *
 * - sendNewOrderNotification - A function that sends a notification to the admin.
 * - NewOrderNotificationInput - The input type for the notification function.
 */

import { ai } from '@/ai/genkit';
import { supabase } from '@/lib/supabase';
import { z } from 'genkit';

const ADMIN_EMAIL = 'admin@gmail.com';

const NewOrderNotificationInputSchema = z.object({
  orderId: z.string().describe('The ID of the new order.'),
  username: z.string().describe('The username of the customer who placed the order.'),
  serviceType: z.string().describe('The type of service ordered.'),
  platform: z.string().describe('The platform for which the service was ordered.'),
});
export type NewOrderNotificationInput = z.infer<typeof NewOrderNotificationInputSchema>;

// This is a simple wrapper function to call the flow.
export async function sendNewOrderNotification(input: NewOrderNotificationInput): Promise<void> {
  await newOrderNotificationFlow(input);
}

// Define the Genkit flow
const newOrderNotificationFlow = ai.defineFlow(
  {
    name: 'newOrderNotificationFlow',
    inputSchema: NewOrderNotificationInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    // 1. Get the admin's FCM token from the database
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('fcm_token')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (adminError || !adminUser || !adminUser.fcm_token) {
      console.error("Could not find admin user or admin's FCM token.", adminError);
      return; // Exit if no token is found
    }

    const fcmToken = adminUser.fcm_token;

    // 2. Prepare the notification payload for Firebase Cloud Messaging (FCM)
    const notificationPayload = {
      message: {
        token: fcmToken,
        notification: {
          title: '📦 New Order Received!',
          body: `${input.username} ordered ${input.serviceType} for ${input.platform}.`,
        },
        webpush: {
          fcm_options: {
            // This link will open when the user clicks the notification
            link: `/admin/orders`, 
          },
          notification: {
             // You can add an icon URL here if you have one
             icon: 'https://i.postimg.cc/hXXxpK3k/IMG-20250808-WA0265.jpg',
             // Actions add buttons to the notification
             actions: [
                {
                    action: 'view_order',
                    title: 'View Order'
                }
             ]
          }
        },
      },
    };

    // 3. Send the notification using the FCM API
    // IMPORTANT: This requires setting up authentication with Google Cloud.
    // We need to provide the `fcm_endpoint` and `project_id` from your Firebase project.
    
    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/messages:send`;

    try {
        // We are using `fetch` to call the FCM REST API.
        // This requires getting an access token for authentication.
        // The `googleAI` plugin in Genkit can help us get this token automatically.
        const auth = await ai.getPlugin('googleai')?.getAuth();
        if (!auth) {
            throw new Error('Could not get Google authentication for FCM.');
        }
        const headers = await auth.getHeaders();
        
        const response = await fetch(fcmEndpoint, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationPayload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`FCM request failed with status ${response.status}: ${errorBody}`);
        }

        console.log('Successfully sent FCM notification.');

    } catch (error) {
        console.error('An error occurred while sending the FCM notification:', error);
    }
  }
);
