import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { orderId, email, name, totalAmount, items } = await request.json();

    if (!orderId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'MARQUE RC <orders@yourdomain.com>', // User needs to configure their verified domain in Resend
      to: [email],
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h1 style="color: #f97316; text-transform: uppercase;">Order Confirmed!</h1>
          <p>Hi ${name || 'Racer'},</p>
          <p>Thank you for choosing MARQUE RC. We've received your order <strong>${orderId}</strong> and we're getting it ready for dispatch.</p>
          
          <div style="background-color: #0f172a; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #1e293b;">
            <h2 style="color: #e2e8f0; font-size: 16px; text-transform: uppercase;">Order Summary</h2>
            <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
            <p><strong>Items:</strong> ${items.length} unit(s)</p>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px;">You will receive another email with your tracking AWB number once the package ships.</p>
          <p style="color: #f97316; font-weight: bold; margin-top: 30px;">Keep Bashing,<br/>The MARQUE Team</p>
        </div>
      `
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error: any) {
    console.error("Email Sending Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
