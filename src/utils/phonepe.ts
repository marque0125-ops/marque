export interface PhonePeToken {
  token: string;
  tokenType: string;
}

let cachedToken: {
  token: string;
  tokenType: string;
  expiresAt: number;
} | null = null;

export async function getPhonePeAuthToken(): Promise<PhonePeToken> {
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
  const isProduction = process.env.PHONEPE_ENV === 'PRODUCTION';

  if (!clientId || !clientSecret) {
    throw new Error('PhonePe credentials (PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET) not configured');
  }

  // Use cached token if valid for at least 1 more minute
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return { token: cachedToken.token, tokenType: cachedToken.tokenType };
  }

  const tokenUrl = isProduction
    ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token';

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_version', clientVersion);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`PhonePe OAuth token failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const token = data.access_token;
  const tokenType = data.token_type || 'O-Bearer';
  const expiresIn = (data.expires_in || 3600) * 1000;

  cachedToken = {
    token,
    tokenType,
    expiresAt: Date.now() + expiresIn
  };

  return { token, tokenType };
}

export function getPhonePeCheckoutUrl(): string {
  const isProduction = process.env.PHONEPE_ENV === 'PRODUCTION';
  return isProduction
    ? 'https://api.phonepe.com/apis/pg/checkout/v2/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay';
}

export function getPhonePeStatusUrl(merchantOrderId: string): string {
  const isProduction = process.env.PHONEPE_ENV === 'PRODUCTION';
  const host = isProduction
    ? 'https://api.phonepe.com/apis/pg'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  return `${host}/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=false`;
}
