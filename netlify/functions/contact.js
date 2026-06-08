import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ message: 'Method not allowed.' }),
    };
  }

  const { name, email, subject, message } = JSON.parse(event.body || '{}');

  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide name, email, subject, and message.' }),
    };
  }

  const EMAIL_FROM = process.env.EMAIL_FROM || 'admin@amajubaeconomicchamber.org';
  const EMAIL_TO = process.env.EMAIL_TO || 'admin@amajubaeconomicchamber.org';

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || '465');
  const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  async function sendMail(mailOptions) {
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const info = await transporter.sendMail(mailOptions);
        if (Array.isArray(info.accepted) && info.accepted.length === 0) {
          throw new Error(`No recipients accepted by SMTP provider. Rejected: ${JSON.stringify(info.rejected)}`);
        }
        return info;
      }

      if (RESEND_API_KEY) {
        const resp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
          }),
        });

        const text = await resp.text();
        if (!resp.ok) {
          throw new Error(`Resend API error: ${resp.status} ${text}`);
        }

        return { messageId: 'resend', accepted: [mailOptions.to] };
      }

      throw new Error('No email provider configured (missing SMTP credentials and RESEND_API_KEY).');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      throw new Error(`Email send failed: ${errorMessage}`);
    }
  }

  try {
    const mailOptions = {
      from: EMAIL_FROM,
      sender: process.env.EMAIL_USER || EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: email,
      subject: `Contact form message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    };

    const info = await sendMail(mailOptions);
    console.debug('Contact function email sent:', { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully.' }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Contact function error:', errorMessage);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Unable to send your message right now. Please try again later.',
        ...(process.env.NODE_ENV !== 'production' ? { error: errorMessage } : {}),
      }),
    };
  }
};
