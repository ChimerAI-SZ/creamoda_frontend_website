// app/api/capture-order/route.ts
import { NextRequest } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { getClient } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await getClient().execute(request);
    return Response.json(response.result);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
