
// This file connects to Supabase for data management.
"use client";

import { supabase } from "./supabase";
import type { User, Order, Service, NewOrder, NewUser, ServicePrices } from "@/types";

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

  const username = `user${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: dbData, error: dbError } = await supabase
    .from("users")
    .insert({
      id: authData.user.id,
      email: newUser.email,
      username: username,
      funds: 0
    })
    .select()
    .single();

  if (dbError) {
    console.error("Error inserting user into database:", dbError);
    // Potentially delete the auth user here to clean up
    return { user: null, error: "Could not save user profile." };
  }

  return { user: dbData };
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
    }));
    
    const { data: result, error } = await supabase.from('services').insert(newServices).select();

    if (error) {
        console.error("Error adding services:", error);
        return null;
    }
    return result;
};

export const updateService = async (id: string, data: Omit<Service, 'id' | 'available'>): Promise<Service | null> => {
    const serviceUpdate = {
        ...data,
        platform: data.platform.toLowerCase(),
        type: data.type.toLowerCase(),
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
    // Manually map response to Order type to handle column name differences
    return data?.map(o => ({
        ...o,
        userEmail: o.user_email,
        serviceId: o.service_id,
        serviceType: o.service_type,
        createdAt: o.created_at,
        link: o.url,
    })) || [];
}

export const placeOrder = async (newOrder: NewOrder): Promise<Order | null> => {
    const user = await getUser(newOrder.userEmail);
    const service = await getServiceById(newOrder.serviceId);

    if (!user || !service || !service.available) return null;

    const totalPrice = newOrder.quantity * service.price;

    if (user.funds < totalPrice) return null;
    if (newOrder.quantity < service.min || newOrder.quantity > service.max) return null;

    const orderData = {
        user_email: newOrder.userEmail,
        username: user.username,
        service_id: newOrder.serviceId,
        platform: service.platform,
        service_type: service.type,
        quantity: newOrder.quantity,
        price: totalPrice,
        url: newOrder.link,
        status: "Pending",
    }

    const { data: createdOrder, error } = await supabase.from('orders').insert(orderData).select().single();

    if (error) {
        console.error("Error placing order:", JSON.stringify(error, null, 2));
        return null;
    }

    const newBalance = user.funds - totalPrice;
    await setUserFunds(user.email, newBalance);

    return { ...createdOrder, createdAt: createdOrder.created_at, serviceType: createdOrder.service_type, userEmail: createdOrder.user_email, serviceId: createdOrder.service_id, link: createdOrder.url };
}

export const updateOrderStatus = async (orderId: string, status: "Complete" | "Cancelled"): Promise<Order | null> => {
    const { data: order, error: fetchError } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (fetchError || !order) {
        console.error("Error fetching order to update status:", fetchError);
        return null;
    }

    if (order.status !== 'Pending') return null;

    if (status === 'Cancelled') {
        const user = await getUser(order.user_email);
        if(user) {
            const newBalance = user.funds + order.price;
            await setUserFunds(user.email, newBalance);
        }
    }
    
    const { data: updatedOrder, error: updateError } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
    
    if (updateError) {
        console.error("Error updating order status:", updateError);
        // If status update fails, revert the fund cancellation if it happened
        if (status === 'Cancelled') {
            const user = await getUser(order.user_email);
            if(user) {
                await setUserFunds(user.email, user.funds - order.price);
            }
        }
        return null;
    }

    return { ...updatedOrder, createdAt: updatedOrder.created_at, serviceType: updatedOrder.service_type, userEmail: updatedOrder.user_email, serviceId: updatedOrder.service_id, link: updatedOrder.url };
}


// --- DUMMY/LEGACY FUNCTIONS ---
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

    