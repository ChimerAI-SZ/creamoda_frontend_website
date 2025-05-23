// app/api/create-order/route.ts
import { NextRequest } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { getClient } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { value, currency } = body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency || 'USD',
          value: value.toString()
        }
      }
    ]
  });

  try {
    const response = await getClient().execute(request);
    return new Response(JSON.stringify(response.result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    });
  }
}
