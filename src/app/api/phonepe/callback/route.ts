export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getPhonePeAuthToken, getPhonePeStatusUrl } from '../../../../utils/phonepe';

async function handlePhonePeCallback(request: Request) {
  const url = new URL(request.url);

  // Log all incoming params to help debug
  const allParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { allParams[key] = value; });
  console.log('PhonePe Callback received. URL params:', JSON.stringify(allParams));

  // Step 1: Get the merchantOrderId
  let merchantOrderId =
    url.searchParams.get('orderId') ||
    url.searchParams.get('merchantOrderId') ||
    url.searchParams.get('transactionId') ||
    url.searchParams.get('merchantTransactionId');

  // For POST callbacks, check form data / JSON body
  if (!merchantOrderId && request.method === 'POST') {
    try {
      const rawBody = await request.text();
      console.log('PhonePe POST body:', rawBody);

      const formParsed = new URLSearchParams(rawBody);
      merchantOrderId =
        formParsed.get('orderId') ||
        formParsed.get('merchantOrderId') ||
        formParsed.get('transactionId');

      if (!merchantOrderId) {
        try {
          const json = JSON.parse(rawBody);
          merchantOrderId =
            json.orderId ||
            json.merchantOrderId ||
            json.transactionId ||
            json.data?.merchantOrderId ||
            json.data?.merchantTransactionId ||
            json.payload?.merchantOrderId;
        } catch (_) {}
      }
    } catch (_) {}
  }

  const baseUrl = `${url.protocol}//${url.host}`;

  if (!merchantOrderId) {
    console.error('PhonePe callback: Could not determine merchantOrderId from any source. Redirecting to cart.');
    return NextResponse.redirect(`${baseUrl}/checkout/callback?status=PAYMENT_ERROR`, { status: 302 });
  }

  let status = 'PAYMENT_PENDING';

  try {
    const { token, tokenType } = await getPhonePeAuthToken();
    const statusUrl = getPhonePeStatusUrl(merchantOrderId);

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${token}`
      }
    });

    const statusResponse = await response.json();
    console.log('PhonePe getOrderStatus response:', JSON.stringify(statusResponse));

    // PhonePe V2 returns: state = 'COMPLETED' | 'PENDING' | 'FAILED'
    const state = statusResponse?.state || statusResponse?.code || '';

    if (state === 'COMPLETED' || state === 'PAYMENT_SUCCESS' || state === 'SUCCESS') {
      status = 'PAYMENT_SUCCESS';
    } else if (state === 'FAILED' || state === 'PAYMENT_ERROR') {
      status = 'PAYMENT_ERROR';
    } else {
      status = 'PAYMENT_PENDING';
    }
  } catch (statusError: any) {
    console.error('Error verifying order status with PhonePe API:', statusError?.message || statusError);
    // User redirected back from PhonePe PG - keep as PAYMENT_PENDING so order creation proceeds
    status = 'PAYMENT_PENDING';
  }

  console.log(`PhonePe Callback - Final status: ${status} for order: ${merchantOrderId}`);

  const redirectUrl = `${baseUrl}/checkout/callback?status=${status}&orderId=${merchantOrderId}`;
  return NextResponse.redirect(redirectUrl, { status: 302 });
}

export async function GET(request: Request) {
  return handlePhonePeCallback(request);
}

export async function POST(request: Request) {
  return handlePhonePeCallback(request);
}
