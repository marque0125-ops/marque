export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase } from '../../../../utils/supabase';

export async function POST(request: Request) {
  try {
    const rawBodyText = await request.text();
    let data: any;
    try {
      data = JSON.parse(rawBodyText);
    } catch {
      console.error("Webhook payload not JSON");
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    console.log('PhonePe Webhook payload received:', JSON.stringify(data));

    // Support PhonePe V2 JSON payload format
    const payload = data.payload || data.data || data;
    const state = payload.state || payload.code || data.code;
    const merchantOrderId = payload.merchantOrderId || payload.merchantTransactionId;

    if (
      (state === 'COMPLETED' || state === 'PAYMENT_SUCCESS' || state === 'SUCCESS') &&
      merchantOrderId
    ) {
      console.log(`PhonePe Webhook Success Confirmed for Order: ${merchantOrderId}`);

      // Update order status in Supabase
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id")) {
        const { error } = await (supabase
          .from('orders') as any)
          .update({ status: 'confirmed' })
          .eq('id', merchantOrderId);

        if (error) {
          console.error("Supabase Order Update Error via Webhook:", error);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" }, { status: 200 });

  } catch (err: any) {
    console.error("PhonePe Webhook processing error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
