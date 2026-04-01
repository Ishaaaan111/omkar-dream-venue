import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, id, name, email, details } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const shortId = id.split('-')[0];
    const subject = type === 'room_booking' 
      ? `Booking Confirmed - Hotel OMKAR (#${shortId})` 
      : `Event Inquiry Confirmed - Hotel OMKAR`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
          .logo { color: #fbbf24; font-size: 28px; font-weight: bold; letter-spacing: 2px; margin-bottom: 10px; }
          .badge { background: #fbbf24; color: #0f172a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 20px; font-weight: 600; color: #0f172a; margin-bottom: 20px; }
          .details-card { background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #fbbf24; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600; }
          .value { color: #0f172a; font-weight: 500; font-size: 14px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
          .button { display: inline-block; background: #fbbf24; color: #0f172a; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HOTEL OMKAR</div>
            <div class="badge">Confirmation Confirmed</div>
            <h1 style="margin: 15px 0 0; font-size: 24px; color: #ffffff;">Your Stay is Approved!</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <p>We are delighted to inform you that your request at <strong>Hotel OMKAR & Dream Venue</strong> has been officially confirmed.</p>
            
            <div class="details-card">
              <h3 style="margin-top: 0; font-size: 16px; color: #fbbf24; margin-bottom: 15px;">Summary of ${type === 'room_booking' ? 'Stay' : 'Event'}</h3>
              
              ${type === 'room_booking' ? `
                <div class="detail-row">
                  <span class="label">Room Type</span>
                  <span class="value">${details.room_type.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-in</span>
                  <span class="value">${details.check_in}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-out</span>
                  <span class="value">${details.check_out}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Guests</span>
                  <span class="value">${details.guests}</span>
                </div>
              ` : `
                <div class="detail-row">
                  <span class="label">Event Type</span>
                  <span class="value">${details.event_type.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Event Date</span>
                  <span class="value">${details.event_date}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Expected Guests</span>
                  <span class="value">${details.expected_guests}</span>
                </div>
              `}
            </div>

            <p>If you have any questions, feel free to contact us directly at our reception.</p>
            
            <center>
              <a href="https://wa.me/919999999999" class="button">Contact on WhatsApp</a>
            </center>
          </div>
          <div class="footer">
            <p>&copy; 2024 Hotel OMKAR & Dream Venue. All rights reserved.</p>
            <p>Pune-Mumbai Expressway, Near Somatne Phata, Pune.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Hotel OMKAR <notifications@resend.dev>',
      to: [email],
      reply_to: 'admin@omkartarade.com',
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
