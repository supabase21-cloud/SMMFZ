

export interface NewUser {
    email: string;
    password: string;
}

export interface User {
    id: string; // This will be the Supabase auth user ID
    email: string;
    username: string;
    funds: number;
    created_at: string;
    password?: string; // Password should not be stored here, just used for creation
}

export type Platform = "instagram" | "tiktok" | "youtube" | string;
export type ServiceType = "followers" | "likes" | string;

export interface Service {
    id: string;
    platform: Platform;
    type: ServiceType;
    available: boolean;
    price: number; // Price per unit
    min: number;
    max: number;
    user_cooldown_hours: number;
    link_cooldown_hours: number;
}

export interface NewOrder {
    userEmail: string;
    serviceId: string;
    quantity: number;
    link: string;
    comments?: string[];
}

export interface Order {
    id:string;
    userEmail: string; // maps to user_email
    username: string;
    serviceId: string; // maps to service_id
    platform: Platform;
    serviceType: ServiceType; // maps to service_type
    quantity: number;
    price: number;
    status: "Pending" | "Complete" | "Cancelled";
    link: string; // Corresponds to 'url' in the database but used as 'link' in the app
    createdAt: string; // maps to created_at
    comments?: string[] | null;
}

export type PlaceOrderResult = 
    | { success: true; order: Order }
    | { success: false; error: string; errorType?: 'GENERAL' }
    | { success: false; error: string; errorType: 'LINK_COOLDOWN'; cooldownExpiry: number }
    | { success: false; error: string; errorType: 'USER_COOLDOWN'; cooldownExpiry: number };


// This is kept for the old pricing page, but new services use the price on the service object.
export type ServicePrices = {
    [key in Platform]: {
        [key in ServiceType]: number;
    };
};

    