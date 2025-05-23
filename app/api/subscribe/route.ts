// app/api/subscribe/route.ts
import { NextRequest } from 'next/server';
import { getAccessToken } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  const { plan_id } = await req.json();

  try {
    const accessToken = await getAccessToken();
    const res = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        plan_id,
        application_context: {
          brand_name: 'YourBrand',
          user_action: 'SUBSCRIBE_NOW',
          return_url: 'https://yourdomain.com/success',
          cancel_url: 'https://yourdomain.com/cancel'
        }
      })
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
