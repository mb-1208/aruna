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
