import { Resend } from 'resend';

// Initialize Resend client safely
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Sender & Recipient addresses with environment overrides
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Aruna Travel Studio <onboarding@resend.dev>';
const TO_EMAIL = process.env.RESEND_TO_EMAIL || 'arunatravelstudio@gmail.com';

/**
 * Sends a stylized email notification when a customer submits an inquiry
 * for either a Retreat or a Travel Service.
 */
export async function sendInquiryEmail({ name, email, phone, retreatTitle, dateStr, isService }) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY is not configured. Skipping email notification.');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const itemType = isService ? 'Travel Service' : 'Retreat Package';
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar', dateStyle: 'full', timeStyle: 'short' });

    const subject = `[New Inquiry] ${retreatTitle || itemType} - ${name || 'Prospective Guest'}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EFEAE3; }
            .header { background: linear-gradient(135deg, #C28E5C 0%, #A87140 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
            .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 32px 28px; }
            .badge { display: inline-block; background: #F3ECE2; color: #A87140; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
            .details-table td { padding: 12px 0; border-bottom: 1px solid #F0EAE1; font-size: 15px; }
            .details-table td.label { width: 35%; color: #7A7A7A; font-weight: 500; }
            .details-table td.value { width: 65%; color: #1A1A1A; font-weight: 600; }
            .actions { text-align: center; margin-top: 24px; }
            .btn { display: inline-block; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 6px; }
            .btn-wa { background: #25D366; color: #FFFFFF; }
            .btn-email { background: #A87140; color: #FFFFFF; }
            .footer { background: #FAF7F2; padding: 20px; text-align: center; font-size: 12px; color: #9A9A9A; border-top: 1px solid #EFEAE3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ARUNA TRAVEL STUDIO</h1>
              <p>New Guest Inquiry Received</p>
            </div>
            <div class="content">
              <span class="badge">${itemType}</span>
              <table class="details-table">
                <tr>
                  <td class="label">Guest Name</td>
                  <td class="value">${name || '-'}</td>
                </tr>
                <tr>
                  <td class="label">Email Address</td>
                  <td class="value"><a href="mailto:${email}" style="color: #A87140; text-decoration: none;">${email || '-'}</a></td>
                </tr>
                <tr>
                  <td class="label">Phone / WhatsApp</td>
                  <td class="value">${phone || '-'}</td>
                </tr>
                <tr>
                  <td class="label">${isService ? 'Service' : 'Retreat'}</td>
                  <td class="value">${retreatTitle || '-'}</td>
                </tr>
                ${!isService ? `
                <tr>
                  <td class="label">Dates / Package</td>
                  <td class="value">${dateStr || '-'}</td>
                </tr>` : ''}
                <tr>
                  <td class="label">Received At</td>
                  <td class="value" style="font-weight: 400; color: #666;">${now} (Bali Time)</td>
                </tr>
              </table>

              <div class="actions">
                ${waLink ? `<a href="${waLink}" class="btn btn-wa" target="_blank">Chat on WhatsApp</a>` : ''}
                <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Inquiry for ${retreatTitle}`)}" class="btn btn-email">Reply via Email</a>
              </div>
            </div>
            <div class="footer">
              This notification was generated automatically from arunatravelstudio.com
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subject,
      html: html,
    });

    if (result.error) {
      console.error('[Resend Error sending inquiry email]:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('[sendInquiryEmail Exception]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a stylized email notification when a customer submits the Contact Form.
 */
export async function sendContactEmail({ name, email, phone, subject, message }) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY is not configured. Skipping email notification.');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar', dateStyle: 'full', timeStyle: 'short' });

    const emailSubject = `[Contact Form] ${subject || 'New Message'} - ${name || 'Website Visitor'}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EFEAE3; }
            .header { background: linear-gradient(135deg, #C28E5C 0%, #A87140 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
            .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 32px 28px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            .details-table td { padding: 10px 0; border-bottom: 1px solid #F0EAE1; font-size: 15px; }
            .details-table td.label { width: 30%; color: #7A7A7A; font-weight: 500; }
            .details-table td.value { width: 70%; color: #1A1A1A; font-weight: 600; }
            .message-box { background: #FAF7F2; border-left: 4px solid #A87140; padding: 16px; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #333; margin-bottom: 24px; white-space: pre-wrap; }
            .actions { text-align: center; margin-top: 24px; }
            .btn { display: inline-block; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 6px; }
            .btn-wa { background: #25D366; color: #FFFFFF; }
            .btn-email { background: #A87140; color: #FFFFFF; }
            .footer { background: #FAF7F2; padding: 20px; text-align: center; font-size: 12px; color: #9A9A9A; border-top: 1px solid #EFEAE3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ARUNA TRAVEL STUDIO</h1>
              <p>New Contact Form Submission</p>
            </div>
            <div class="content">
              <table class="details-table">
                <tr>
                  <td class="label">Sender</td>
                  <td class="value">${name || '-'}</td>
                </tr>
                <tr>
                  <td class="label">Email</td>
                  <td class="value"><a href="mailto:${email}" style="color: #A87140; text-decoration: none;">${email || '-'}</a></td>
                </tr>
                <tr>
                  <td class="label">Phone</td>
                  <td class="value">${phone || '-'}</td>
                </tr>
                <tr>
                  <td class="label">Subject</td>
                  <td class="value">${subject || '-'}</td>
                </tr>
                <tr>
                  <td class="label">Date</td>
                  <td class="value" style="font-weight: 400; color: #666;">${now} (Bali Time)</td>
                </tr>
              </table>

              <h4 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #7A7A7A;">Message</h4>
              <div class="message-box">${message || '-'}</div>

              <div class="actions">
                ${waLink ? `<a href="${waLink}" class="btn btn-wa" target="_blank">Chat on WhatsApp</a>` : ''}
                <a href="mailto:${email}?subject=${encodeURIComponent(`Re: ${subject || 'Contact Inquiry'}`)}" class="btn btn-email">Reply via Email</a>
              </div>
            </div>
            <div class="footer">
              This message was submitted via the contact page on arunatravelstudio.com
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: emailSubject,
      html: html,
    });

    if (result.error) {
      console.error('[Resend Error sending contact email]:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('[sendContactEmail Exception]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a notification when someone joins a waiting list.
 */
export async function sendWaitingListEmail({ email, productTitle }) {
  if (!resend) return { success: false };

  try {
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar', dateStyle: 'full', timeStyle: 'short' });
    const subject = `[Waiting List] ${productTitle || 'Retreat'} - ${email}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EFEAE3; }
            .header { background: linear-gradient(135deg, #C28E5C 0%, #A87140 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
            .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 32px 28px; }
            .badge { display: inline-block; background: #F3ECE2; color: #A87140; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
            .details-table td { padding: 12px 0; border-bottom: 1px solid #F0EAE1; font-size: 15px; }
            .details-table td.label { width: 35%; color: #7A7A7A; font-weight: 500; }
            .details-table td.value { width: 65%; color: #1A1A1A; font-weight: 600; }
            .actions { text-align: center; margin-top: 24px; }
            .btn { display: inline-block; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 6px; }
            .btn-email { background: #A87140; color: #FFFFFF; }
            .footer { background: #FAF7F2; padding: 20px; text-align: center; font-size: 12px; color: #9A9A9A; border-top: 1px solid #EFEAE3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ARUNA TRAVEL STUDIO</h1>
              <p>Waiting List Registration</p>
            </div>
            <div class="content">
              <span class="badge">Waitlist Entry</span>
              <p style="font-size: 15px; color: #555; margin-bottom: 20px;">
                A guest has joined the waiting list for an upcoming experience:
              </p>
              <table class="details-table">
                <tr>
                  <td class="label">Guest Email</td>
                  <td class="value"><a href="mailto:${email}" style="color: #A87140; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td class="label">Experience</td>
                  <td class="value">${productTitle || '-'}</td>
                </tr>
                <tr>
                  <td class="label">Registered At</td>
                  <td class="value" style="font-weight: 400; color: #666;">${now} (Bali Time)</td>
                </tr>
              </table>

              <div class="actions">
                <a href="mailto:${email}?subject=${encodeURIComponent(`Update on ${productTitle || 'Aruna Experience'}`)}" class="btn btn-email">Contact Guest</a>
              </div>
            </div>
            <div class="footer">
              This waiting list entry was submitted on arunatravelstudio.com
            </div>
          </div>
        </body>
      </html>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subject,
      html: html,
    });
  } catch (err) {
    console.error('[sendWaitingListEmail Exception]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a notification when someone subscribes via Promo Popup or Newsletter.
 */
export async function sendNewsletterSubscriberEmail({ email, source, details }) {
  if (!resend) return { success: false };

  try {
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar', dateStyle: 'full', timeStyle: 'short' });
    const subject = `[New Subscriber] ${email} via ${source || 'Newsletter'}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #2C2C2C; }
            .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EFEAE3; }
            .header { background: linear-gradient(135deg, #C28E5C 0%, #A87140 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
            .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 32px 28px; }
            .badge { display: inline-block; background: #F3ECE2; color: #A87140; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
            .details-table td { padding: 12px 0; border-bottom: 1px solid #F0EAE1; font-size: 15px; }
            .details-table td.label { width: 35%; color: #7A7A7A; font-weight: 500; }
            .details-table td.value { width: 65%; color: #1A1A1A; font-weight: 600; }
            .actions { text-align: center; margin-top: 24px; }
            .btn { display: inline-block; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 6px; }
            .btn-email { background: #A87140; color: #FFFFFF; }
            .footer { background: #FAF7F2; padding: 20px; text-align: center; font-size: 12px; color: #9A9A9A; border-top: 1px solid #EFEAE3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ARUNA TRAVEL STUDIO</h1>
              <p>New Newsletter Subscriber</p>
            </div>
            <div class="content">
              <span class="badge">Audience Growth</span>
              <p style="font-size: 15px; color: #555; margin-bottom: 20px;">
                A new member has subscribed to the Aruna mailing list:
              </p>
              <table class="details-table">
                <tr>
                  <td class="label">Subscriber Email</td>
                  <td class="value"><a href="mailto:${email}" style="color: #A87140; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td class="label">Source Form</td>
                  <td class="value">${source || 'Website Form'}</td>
                </tr>
                ${details ? `
                <tr>
                  <td class="label">Campaign / Details</td>
                  <td class="value">${details}</td>
                </tr>` : ''}
                <tr>
                  <td class="label">Timestamp</td>
                  <td class="value" style="font-weight: 400; color: #666;">${now} (Bali Time)</td>
                </tr>
              </table>

              <div class="actions">
                <a href="mailto:${email}?subject=Welcome to Aruna Travel Studio" class="btn btn-email">Send Welcome Note</a>
              </div>
            </div>
            <div class="footer">
              This subscriber was registered and stored in the Aruna CMS Leads repository.
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subject,
      html: html,
    });

    if (result.error) {
      console.error('[Resend Error sending subscriber email]:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('[sendNewsletterSubscriberEmail Exception]:', err);
    return { success: false, error: err.message };
  }
}
