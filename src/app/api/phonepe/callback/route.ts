import { NextResponse } from 'next/server';
import { StandardCheckoutClient, Env } from '@phonepe-pg/pg-sdk-node';

async function handlePhonePeCallback(request: Request) {
  try {
    const url = new URL(request.url);
    
    // Attempt to extract order ID and transaction ID. PhonePe might send them as query params on GET 
    // or as form data on POST.
    let merchantOrderId = url.searchParams.get('transactionId') || url.searchParams.get('merchantOrderId') || url.searchParams.get('orderId');
    let code = url.searchParams.get('code');
    
    // If it's a POST request, PhonePe sends data in the body
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        if (formData.has('transactionId')) merchantOrderId = formData.get('transactionId') as string;
        if (formData.has('merchantOrderId')) merchantOrderId = formData.get('merchantOrderId') as string;
        if (formData.has('code')) code = formData.get('code') as string;
      } catch (e) {
        // Not form data, maybe JSON
        try {
          const json = await request.json();
          if (json.transactionId) merchantOrderId = json.transactionId;
          if (json.merchantOrderId) merchantOrderId = json.merchantOrderId;
          if (json.code) code = json.code;
        } catch (err) {
          // Ignore parse errors if body is empty or malformed
        }
      }
    }

    if (!merchantOrderId) {
      console.error("PhonePe callback missing merchantOrderId");
      // Redirect to failure if we can't identify the order
      return NextResponse.redirect(new URL('/checkout/callback?status=PAYMENT_ERROR', request.url));
    }

    // Initialize SDK client
    const clientId = process.env.PHONEPE_CLIENT_ID || 'test_client_id';
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET || 'test_client_secret';
    const env = process.env.PHONEPE_ENV === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;
    const clientVersion = 1;

    const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

    // Verify payment status with PhonePe
    let status = 'PAYMENT_PENDING';
    
    try {
      const statusResponse = await client.getOrderStatus(merchantOrderId);
      
      // statusResponse.state contains the status like 'COMPLETED', 'FAILED', 'PENDING'
      if (statusResponse && statusResponse.state === 'COMPLETED') {
        status = 'PAYMENT_SUCCESS';
      } else if (statusResponse && statusResponse.state === 'FAILED') {
        status = 'PAYMENT_ERROR';
      }
    } catch (statusError) {
      console.error("Error fetching order status from PhonePe:", statusError);
      // If we can't verify, we'll rely on the code returned by PhonePe, though it's less secure
      if (code === 'PAYMENT_SUCCESS') {
         status = 'PAYMENT_SUCCESS';
      } else if (code) {
         status = 'PAYMENT_ERROR';
      }
    }

    // Redirect user to the frontend callback page
    const redirectUrl = new URL(`/checkout/callback?status=${status}&orderId=${merchantOrderId}`, request.url);
    return NextResponse.redirect(redirectUrl, {
      status: 302, // Found / Redirect
    });

  } catch (error) {
    console.error("PhonePe Callback Error:", error);
    return NextResponse.redirect(new URL('/checkout/callback?status=PAYMENT_ERROR', request.url));
  }
}

export async function GET(request: Request) {
  return handlePhonePeCallback(request);
}

export async function POST(request: Request) {
  return handlePhonePeCallback(request);
}
