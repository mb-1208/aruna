"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function subscribeEmail(email, source = "Unknown", details = "") {
  try {
    const supabase = supabaseAdmin;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Invalid email address." };
    }

    const { error } = await supabase
      .from("leads")
      .insert([
        { 
          email: email.toLowerCase().trim(),
          source: source,
          details: details
        }
      ]);

    if (error) {
      console.error("Error inserting lead:", error);
      // Handle unique constraint violations if email is already subscribed
      if (error.code === '23505') {
         return { success: true, message: "You are already subscribed!" };
      }
      return { success: false, error: "Failed to subscribe. Please try again later." };
    }

    return { success: true, message: "Thank you for subscribing!" };
  } catch (err) {
    console.error("Subscription error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function joinWaitingList(email, productTitle) {
  try {
    const supabase = supabaseAdmin;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Invalid email address." };
    }

    const { error } = await supabase
      .from("leads")
      .insert([
        { 
          email: email.toLowerCase().trim(),
          source: "Waiting List",
          details: `Product: ${productTitle}`
        }
      ]);

    if (error) {
      console.error("Error inserting lead:", error);
      if (error.code === '23505') {
         return { success: true, message: "You are already on the waiting list!" };
      }
      return { success: false, error: "Failed to join waiting list. Please try again later." };
    }

    return { success: true, message: "Thank you for joining the waiting list!" };
  } catch (err) {
    console.error("Waiting list error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}


export async function submitInquiry(data) {
  try {
    const supabase = supabaseAdmin;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      return { success: false, error: 'Invalid email address.' };
    }
    const details = `Name: ${data.name || '-'}, Phone: ${data.phone || '-'}, Retreat: ${data.retreatTitle || '-'}, Date: ${data.dateStr || '-'}`;
    const { error } = await supabase.from('leads').insert([{
      email: data.email.toLowerCase().trim(),
      source: 'Retreat Inquiry',
      details: details
    }]);
    if (error) {
      console.error('Error inserting lead:', error);
      return { success: false, error: 'Failed to submit inquiry. Please try again later.' };
    }
    return { success: true, message: 'Inquiry submitted successfully!' };
  } catch (err) {
    console.error('Inquiry error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}