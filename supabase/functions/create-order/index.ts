// Deno/TypeScript Supabase Edge Function: create-order
// Serves as the secure backend endpoint for creating Razorpay Orders
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight options
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, address } = await req.json();

    // 1. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Fetch prices from the database to calculate total (preventing client-side tampering)
    let calculatedTotal = 0;
    for (const item of items) {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('price')
        .eq('id', item.id)
        .single();
      
      if (error || !product) {
        throw new Error(`Product not found or invalid: ${item.id}`);
      }
      calculatedTotal += product.price * item.quantity;
    }

    // 3. Request Order creation from Razorpay API
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`
      },
      body: JSON.stringify({
        amount: calculatedTotal * 100, // Amount expected in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
      })
    });

    const razorpayOrder = await response.json();

    if (!response.ok) {
      throw new Error(`Razorpay Order creation failed: ${razorpayOrder.error?.description || 'Unknown error'}`);
    }

    // 4. Return the generated Order ID and details to the client
    return new Response(
      JSON.stringify({ 
        orderId: razorpayOrder.id, 
        amount: calculatedTotal 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
