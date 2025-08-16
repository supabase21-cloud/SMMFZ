

// This file connects to Supabase for data management.
"use client";

import { supabase } from "./supabase";
import type { User, Order, Service, NewOrder, NewUser, ServicePrices, PlaceOrderResult } from "@/types";

// --- USER MANAGEMENT ---
export const getUser = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: "exact one row expected, but 0 rows returned"
    console.error("Error getting user:", error);
    return null;
  }
  return data;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
    if (error && error.code !== 'PGRST116') {
        console.error("Error getting user by username:", error);
        return null;
    }
    return data;
}

export const registerUser = async (newUser: NewUser): Promise<{ user: User | null, error?: string }> => {
  // Step 1: Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: newUser.email,
    password: newUser.password,
  });

  if (authError) {
    console.error("Supabase auth signup error:", authError.message);
    return { user: null, error: authError.message };
  }

  if (!authData.user) {
    console.error("Supabase auth signup did not return a user.");
    return { user: null, error: "Could not create user." };
  }

  // Step 2: The database trigger 'on_auth_user_created' will automatically
  // create an entry in the 'public.users' table. We no longer need to do it from client-side code.
  // We just need to fetch the newly created user profile.

  // Let's try to fetch the user profile a few times, as the trigger might have a slight delay.
  for (let i = 0; i < 5; i++) {
    const { data: dbData, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (dbData) {
      return { user: dbData, error: undefined };
    }
    // Wait for 500ms before retrying
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.error("Could not retrieve user profile from database after registration.");
  return { user: null, error: "Could not save or retrieve user profile." };
};


export const updateUserFunds = async (email: string, amount: number): Promise<User | null> => {
    const user = await getUser(email);
    if (!user) return null;

    const newFunds = user.funds + amount;
    return setUserFunds(email, newFunds);
}

export const setUserFunds = async (email: string, newBalance: number): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .update({ funds: newBalance })
        .eq('email', email)
        .select()
        .single();
    if (error) {
        console.error("Error setting user funds:", error);
        return null;
    }
    return data;
}

// --- SERVICE MANAGEMENT ---
export const getServices = async (): Promise<Service[]> => {
    const { data, error } = await supabase.from('services').select('*').order('platform').order('type');
    if (error) {
        console.error("Error getting services:", JSON.stringify(error, null, 2));
        return [];
    }
    return data || [];
};

export const getServiceById = async (id: string): Promise<Service | undefined> => {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) {
        console.error("Error getting service by ID:", error);
        return undefined;
    }
    return data;
}

export const addService = async (servicesToAdd: (Omit<Service, 'id' | 'available'>)[]): Promise<Service[] | null> => {
    const newServices = servicesToAdd.map(data => ({
        ...data,
        platform: data.platform.toLowerCase(),
        type: data.type.toLowerCase(),
        available: true,
        user_cooldown_hours: data.price === 0 ? data.user_cooldown_hours || 0 : 0,
        link_cooldown_hours: data.price === 0 ? data.link_cooldown_hours || 0 : 0,
    }));
    
    const { data: result, error } = await supabase.from('services').insert(newServices).select();

    if (error) {
        console.error("Error adding services:", error);
        return null;
    }
    return result;
};

export const updateService = async (id: string, data: Partial<Omit<Service, 'id' | 'available'>>): Promise<Service | null> => {
    const serviceUpdate: { [key: string]: any } = {
        ...data,
        platform: data.platform?.toLowerCase(),
        type: data.type?.toLowerCase(),
    };

    // Ensure cooldowns are set to 0 if price is not 0
    if (data.price !== 0) {
        serviceUpdate.user_cooldown_hours = 0;
        serviceUpdate.link_cooldown_hours = 0;
    }

    const { data: result, error } = await supabase.from('services').update(serviceUpdate).eq('id', id).select().single();
     if (error) {
        console.error("Error updating service:", error);
        return null;
    }
    return result;
}

export const updateServiceAvailability = async (id: string, available: boolean): Promise<Service | null> => {
    const { data, error } = await supabase.from('services').update({ available }).eq('id', id).select().single();
    if (error) {
        console.error("Error updating service availability:", error);
        return null;
    }
    return data;
}

export const deleteService = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
        console.error("Error deleting service:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
};


// --- ORDER MANAGEMENT ---
export const getOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error getting orders:", JSON.stringify(error, null, 2));
        return [];
    }
    
    return data?.map((o: any) => ({
        id: o.id,
        userEmail: o.user_email,
        username: o.username,
        serviceId: o.service_id,
        platform: o.platform,
        serviceType: o.service_type,
        quantity: o.quantity,
        price: o.price,
        status: o.status,
        link: o.url,
        createdAt: o.created_at,
        comments: Array.isArray(o.comments) ? o.comments : null,
    })) || [];
}

export const placeOrder = async (newOrder: NewOrder): Promise<PlaceOrderResult> => {
    const user = await getUser(newOrder.userEmail);
    const service = await getServiceById(newOrder.serviceId);

    if (!user || !service || !service.available) {
        return { success: false, error: 'User or service not found, or service is unavailable.' };
    }

    const totalPrice = newOrder.quantity * service.price;

    if (user.funds < totalPrice) {
        return { success: false, error: 'Insufficient funds.' };
    }
    
    const isCommentService = service.type.toLowerCase().includes('comment');

    if (!isCommentService) {
        if (newOrder.quantity < service.min || newOrder.quantity > service.max) {
             return { success: false, error: `Quantity must be between ${service.min} and ${service.max}.` };
        }
    } else {
        if (newOrder.quantity === 0 || !newOrder.comments || newOrder.comments.length === 0) {
            return { success: false, error: 'Comments cannot be empty for this service.' };
        }
    }

    // Check for 0 price service cooldowns
    if (totalPrice === 0) {
        const { user_cooldown_hours, link_cooldown_hours } = service;

        if (user_cooldown_hours > 0) {
            const userCooldownAgo = new Date(Date.now() - user_cooldown_hours * 60 * 60 * 1000).toISOString();
            const { data: recentUserFreeOrder, error: userFreeOrderError } = await supabase
                .from('orders')
                .select('created_at')
                .eq('user_email', newOrder.userEmail)
                .eq('price', 0)
                .gt('created_at', userCooldownAgo)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (userFreeOrderError && userFreeOrderError.code !== 'PGRST116') {
                console.error("Error checking for recent user free orders:", userFreeOrderError);
                return { success: false, error: 'Could not verify free order eligibility.' };
            }

            if (recentUserFreeOrder) {
                const cooldownExpiry = new Date(recentUserFreeOrder.created_at).getTime() + user_cooldown_hours * 60 * 60 * 1000;
                return { success: false, error: `You must wait ${user_cooldown_hours} hour(s) between free orders.`, errorType: 'USER_COOLDOWN', cooldownExpiry };
            }
        }

        if (link_cooldown_hours > 0) {
            const linkCooldownAgo = new Date(Date.now() - link_cooldown_hours * 60 * 60 * 1000).toISOString();
            const { data: recentLinkFreeOrder, error: linkFreeOrderError } = await supabase
                .from('orders')
                .select('created_at')
                .eq('url', newOrder.link) // Check against the link for this specific service
                .eq('service_id', service.id)
                .eq('price', 0)
                .gt('created_at', linkCooldownAgo)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (linkFreeOrderError && linkFreeOrderError.code !== 'PGRST116') { 
                console.error("Error checking for recent link free orders:", linkFreeOrderError);
                return { success: false, error: 'Could not verify free order eligibility.' };
            }

            if (recentLinkFreeOrder) {
                const cooldownExpiry = new Date(recentLinkFreeOrder.created_at).getTime() + link_cooldown_hours * 60 * 60 * 1000;
                return { success: false, error: `User is on cooldown for this free service and link.`, errorType: 'LINK_COOLDOWN', cooldownExpiry };
            }
        }
    }

    const orderData: { [key: string]: any } = {
        user_email: newOrder.userEmail,
        username: user.username,
        service_id: newOrder.serviceId,
        platform: service.platform,
        service_type: service.type,
        quantity: newOrder.quantity,
        price: totalPrice,
        url: newOrder.link,
        status: "Pending",
    };

    if (newOrder.comments && newOrder.comments.length > 0) {
        orderData.comments = newOrder.comments;
    }

    const { data: createdOrder, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
    
    if (error) {
        console.error("Error placing order:", JSON.stringify(error, null, 2));
        return { success: false, error: 'Failed to create order in database.' };
    }

    if (totalPrice > 0) {
        const newBalance = user.funds - totalPrice;
        await setUserFunds(user.email, newBalance);
    }
    
    const resultOrder: Order = {
        id: createdOrder.id,
        userEmail: createdOrder.user_email,
        username: createdOrder.username,
        serviceId: createdOrder.service_id,
        platform: createdOrder.platform,
        serviceType: createdOrder.service_type,
        quantity: createdOrder.quantity,
        price: createdOrder.price,
        status: createdOrder.status,
        link: createdOrder.url,
        createdAt: createdOrder.created_at,
        comments: Array.isArray(createdOrder.comments) ? createdOrder.comments : null,
    };
    return { success: true, order: resultOrder };
};


export const updateOrderStatus = async (orderId: string, status: "Complete" | "Cancelled"): Promise<Order | null> => {
    const { data: order, error: fetchError } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (fetchError || !order) {
        console.error("Error fetching order to update status:", fetchError);
        return null;
    }

    if (order.status !== 'Pending') return null;

    if (status === 'Cancelled' && order.price > 0) {
        const user = await getUser(order.user_email);
        if(user) {
            const newBalance = user.funds + order.price;
            await setUserFunds(user.email, newBalance);
        }
    }
    
    const { data: updatedOrder, error: updateError } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
    
    if (updateError) {
        console.error("Error updating order status:", updateError);
        if (status === 'Cancelled' && order.price > 0) {
            const user = await getUser(order.user_email);
            if(user) {
                await setUserFunds(user.email, user.funds - order.price);
            }
        }
        return null;
    }
    
    const resultOrder: Order = {
        id: updatedOrder.id,
        userEmail: updatedOrder.user_email,
        username: updatedOrder.username,
        serviceId: updatedOrder.service_id,
        platform: updatedOrder.platform,
        serviceType: updatedOrder.service_type,
        quantity: updatedOrder.quantity,
        price: updatedOrder.price,
        status: updatedOrder.status,
        link: updatedOrder.url,
        createdAt: updatedOrder.created_at,
        comments: Array.isArray(updatedOrder.comments) ? updatedOrder.comments : null,
    };
    return resultOrder;
}


// --- ADMIN & DUMMY FUNCTIONS ---
export const getUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return [];
    return data || [];
};
export const getPrices = (): ServicePrices => ({
  instagram: { followers: 0, likes: 0 },
  tiktok: { followers: 0, likes: 0 },
  youtube: { followers: 0, likes: 0 },
});
export const updatePrices = (newPrices: ServicePrices) => { /* no-op */ };

// Session management is now handled by Supabase and AuthContext
export const setSession = (email: string) => { /* no-op */ };
export const getSession = (): string | null => null;
export const clearSession = () => { /* no-op */ };

export * from "@/types";
