export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getPhonePeAuthToken, getPhonePeCheckoutUrl } from '../../../../utils/phonepe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, isCodAdvance } = body; // Amount in rupees

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Convert to paise (PhonePe expects integer paise)
    const amountInPaise = Math.round(amount * 100);
    const prefix = isCodAdvance ? 'CODADV' : 'ORDER';
    const merchantOrderId = `${prefix}_${Date.now()}_${uuidv4().substring(0, 8)}`;

    // Construct the callback URL
    let baseUrl = 'http://localhost:3000';
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
    } else if (request.headers.get('host')) {
      const protocol = request.headers.get('host')?.includes('localhost') ? 'http' : 'https';
      baseUrl = `${protocol}://${request.headers.get('host')}`;
    }

    const callbackUrl = `${baseUrl}/api/phonepe/callback?orderId=${merchantOrderId}`;

    const { token, tokenType } = await getPhonePeAuthToken();
    const checkoutUrl = getPhonePeCheckoutUrl();

    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: isCodAdvance ? 'Advance Payment for Order' : 'Order Checkout Payment',
        merchantUrls: {
          redirectUrl: callbackUrl
        }
      }
    };

    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${token}`
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.redirectUrl) {
      console.error('PhonePe Checkout Error Response:', responseData);
      throw new Error(
        responseData.message ||
        responseData.error ||
        `PhonePe payment initialization failed with HTTP ${response.status}`
      );
    }

    return NextResponse.json({
      id: merchantOrderId,
      redirectUrl: responseData.redirectUrl
    }, { status: 200 });

  } catch (error: any) {
    console.error('PhonePe Initiation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
