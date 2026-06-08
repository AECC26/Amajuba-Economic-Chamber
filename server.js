import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const REG_TABLE = (process.env.SUPABASE_REGISTRATIONS_TABLE || 'public.registrations').trim();
const EMAIL_FROM = process.env.EMAIL_FROM || 'admin@amajubaeconomicchamber.org';
const EMAIL_TO = process.env.EMAIL_TO || 'admin@amajubaeconomicchamber.org';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('Missing EMAIL_USER or EMAIL_PASS environment variables. SMTP will be disabled unless RESEND_API_KEY is provided.');
}

let supabaseAdmin = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} else {
  console.warn('Supabase admin not configured. /api/update-profile will be unavailable locally.');
}

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '465');
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_MODEL = process.env.TOGETHER_MODEL || 'openai/gpt-oss-20b';

// Daily chat limit (per IP). Can be overridden with CHAT_DAILY_LIMIT env var.
const CHAT_DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT || '3');
// Rolling window in milliseconds (5 hours)
const CHAT_MESSAGE_WINDOW_MS = 5 * 60 * 60 * 1000;
// In-memory tracking: { key: [timestamp1, timestamp2, ...] }
const _chatMessageTimestamps = new Map();

async function sendMail(mailOptions) {
  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      if (Array.isArray(info.accepted) && info.accepted.length === 0) {
        throw new Error(`No recipients accepted by SMTP provider. Rejected: ${JSON.stringify(info.rejected)}`);
      }
      return info;
    }

    if (RESEND_API_KEY) {
      const body = {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
      };

      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(body),
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

const ALLOWED_FIELDS = ['first_name', 'last_name', 'email_address', 'phone_number'];

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide name, email, subject, and message.' });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid form data.' });
    }

    console.debug('Contact payload received:', {
      name,
      email,
      subject,
      message: message?.slice(0, 200),
    });

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
    console.debug('Contact email sent:', { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('Contact form email failed:', err);
    return res.status(500).json({
      message: 'Unable to send your message right now. Please try again later.',
      ...(process.env.NODE_ENV !== 'production' ? { error: errorMessage } : {}),
    });
  }
});

app.post('/api/chat', async (req, res) => {
  if (!TOGETHER_API_KEY) {
    return res.status(500).json({ message: 'AI service is not configured.' });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid request payload.' });
    }

    // Determine client IP (respecting X-Forwarded-For when behind proxies)
    const ipHeader = String(req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'] || '').trim();
    const ip = (ipHeader ? ipHeader.split(',')[0].trim() : (req.socket?.remoteAddress || 'unknown')).trim();
    const key = `chat:${ip}`;

    const now = Date.now();
    const cutoffTime = now - CHAT_MESSAGE_WINDOW_MS;

    // Get existing message timestamps and filter out those older than 5 hours
    let timestamps = _chatMessageTimestamps.get(key) || [];
    timestamps = timestamps.filter(ts => ts > cutoffTime);
    _chatMessageTimestamps.set(key, timestamps);

    const currentCount = timestamps.length;
    const remaining = Math.max(0, CHAT_DAILY_LIMIT - currentCount);

    if (currentCount >= CHAT_DAILY_LIMIT) {
      const oldestMessage = timestamps[0] || now;
      const resetTime = new Date(oldestMessage + CHAT_MESSAGE_WINDOW_MS);
      return res.status(429).json({ 
        message: `Message limit reached. You can send more messages after ${resetTime.toLocaleTimeString()}.`,
        remaining: 0,
        resetAt: resetTime.toISOString(),
      });
    }

    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: TOGETHER_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await togetherResponse.json();
    if (!togetherResponse.ok) {
      return res.status(502).json({ message: data?.error?.message || 'Together AI request failed.' });
    }

    // Record the message timestamp
    timestamps.push(now);
    _chatMessageTimestamps.set(key, timestamps);

    return res.status(200).json({
      ...data,
      remaining: remaining - 1, // -1 because we just used one
      resetAt: new Date(now + CHAT_MESSAGE_WINDOW_MS).toISOString(),
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ message: 'Unable to reach the AI service.' });
  }
});

app.post('/api/send-welcome', async (req, res) => {
  if (!TOGETHER_API_KEY) {
    return res.status(500).json({ message: 'AI service is not configured.' });
  }

  try {
    const { email, firstName, lastName } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid email address.' });
    }

    const messages = [
      { role: 'system', content: 'You are a helpful assistant that writes short, friendly welcome emails for new members of a local chamber of commerce.' },
      { role: 'user', content: `Write a warm, professional welcome email to a new member named ${firstName || ''} ${lastName || ''}. Welcome them to the Amajuba Economic Chamber of Commerce and thank them for submitting their registration. Include the following key points:
1. Their registration has been received and is being reviewed
2. They can check their registration status anytime by visiting: https://amajubaeconomicchamber.org/dashboard
3. Once their registration is approved by the Chamber, they will receive a confirmation/approval email
4. Briefly explain what the Chamber is and how it supports members
Keep it concise (around 3 short paragraphs), professional, and sign it as "The Amajuba Economic Chamber Team".` },
    ];

    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({ model: TOGETHER_MODEL, messages, temperature: 0.2, max_tokens: 500 }),
    });

    const togetherData = await togetherResponse.json();
    if (!togetherResponse.ok) {
      return res.status(502).json({ message: togetherData?.error?.message || 'Together AI request failed.' });
    }

    let aiText = '';
    try {
      if (Array.isArray(togetherData.choices) && togetherData.choices[0]) {
        const choice = togetherData.choices[0];
        aiText = choice?.message?.content || choice?.text || JSON.stringify(choice);
      } else if (typeof togetherData.content === 'string') {
        aiText = togetherData.content;
      } else {
        aiText = JSON.stringify(togetherData);
      }
    } catch (err) {
      aiText = '';
    }

    const emailText = aiText || `Welcome to Amajuba Economic Chamber! Visit https://amajubaeconomicchamber.org/dashboard to access your member dashboard.`;

    // Use Resend directly for welcome emails
    if (!RESEND_API_KEY) {
      return res.status(500).json({ message: 'Email service (Resend) is not configured.' });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: email,
        subject: 'Welcome to the Amajuba Economic Chamber of Commerce',
        text: emailText,
        html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">${emailText.replace(/\n/g, '<br/>')}</div>`,
      }),
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return res.status(502).json({ message: resendData?.message || 'Failed to send welcome email via Resend.' });
    }

    console.debug('Welcome email sent via Resend:', { messageId: resendData?.id, to: email });

    return res.status(200).json({ message: 'Welcome email queued.' });
  } catch (err) {
    console.error('send-welcome error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: 'Failed to send welcome email.', error: errorMessage });
  }
});

app.post('/api/update-profile', async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ message: 'Supabase admin is not configured locally.' });
    }

    const auth = req.headers.authorization || req.headers.Authorization || '';
    const match = String(auth).match(/^Bearer\s+(.*)$/i);
    if (!match) return res.status(401).json({ message: 'Missing or invalid authorization header.' });

    const accessToken = match[1];

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return res.status(401).json({ message: 'Invalid session or token.' });
    }

    const user = userData.user;
    if (!user.email) {
      return res.status(400).json({ message: 'Authenticated user has no email.' });
    }

    const body = req.body || {};
    const bodyKeys = Object.keys(body);
    const extra = bodyKeys.filter((k) => !ALLOWED_FIELDS.includes(k));
    if (extra.length > 0) {
      return res.status(400).json({ message: `Unexpected fields: ${extra.join(', ')}` });
    }

    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const val = body[key];
        if (val === null || val === undefined) {
          updates[key] = null;
        } else if (typeof val === 'string' || typeof val === 'number') {
          updates[key] = String(val);
        } else {
          return res.status(400).json({ message: `Invalid value for ${key}` });
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updatable fields provided.' });
    }

    const { data: reg, error: fetchErr } = await supabaseAdmin
      .from(REG_TABLE)
      .select('id, email_address')
      .eq('email_address', user.email)
      .maybeSingle();

    if (fetchErr) {
      return res.status(500).json({ message: 'Unable to fetch registration record.' });
    }

    if (!reg?.id) {
      return res.status(404).json({ message: 'Registration record not found. Complete membership registration first.' });
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from(REG_TABLE)
      .update(updates)
      .eq('id', reg.id)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ message: 'Failed to update registration record.' });
    }

    return res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
