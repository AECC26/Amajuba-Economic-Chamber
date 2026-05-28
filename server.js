/*
  Express server with two API endpoints:

  POST /api/chat
    Proxies chat messages to Together AI, keeping the API key server-side.
    Required env: TOGETHER_API_KEY
    Optional env: TOGETHER_MODEL (defaults to openai/gpt-oss-20b)

  POST /api/update-profile
    Validates and performs profile updates using the Supabase service role key.
    Required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
    Optional env: SUPABASE_REGISTRATIONS_TABLE (defaults to public.registrations)
*/
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_MODEL = process.env.TOGETHER_MODEL || 'openai/gpt-oss-20b';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REG_TABLE = (process.env.SUPABASE_REGISTRATIONS_TABLE || 'public.registrations').trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// ── /api/chat ──────────────────────────────────────────────────────────────
// Proxies messages to Together AI. The API key never reaches the browser.

const SYSTEM_PROMPT = `You are the official virtual assistant for the Amajuba Economic Chamber of Commerce, based in the Amajuba District of KwaZulu-Natal, South Africa. Registration number: 2026 / 354235 / 08.

Your role is to warmly and helpfully answer questions about:
- The Chamber's vision, mission, and strategic framework
- The three economic sectors: Primary (Agriculture & Mining), Secondary (Manufacturing & Processing), Tertiary (Services & Distribution)
- Community empowerment programmes (governance literacy, tendering & procurement, fund management, LED partnerships)
- Membership categories and the registration process
- The Chamber's governance structure and leadership
- Local Economic Development (LED) initiatives in the Amajuba District
- Contact information: amajubaeconomicchamber.office@gmail.com | 067 198 4100 / 068 334 1826 | Madadeni Sec 6, Red Street, Industrial Side, Unit 9, KwaZulu-Natal

Speak professionally but warmly. Keep answers concise and helpful. If asked something outside the Chamber's scope, politely redirect to what you can help with. Always represent the Chamber's values of promoting growth, prosperity, and community empowerment.`;

app.post('/api/chat', async (req, res) => {
  if (!TOGETHER_API_KEY) {
    return res.status(503).json({ message: 'AI assistant is not configured on this server.' });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'messages array is required.' });
  }

  // Validate each message has role and string content only
  const allowed = ['user', 'assistant'];
  for (const msg of messages) {
    if (!allowed.includes(msg.role) || typeof msg.content !== 'string') {
      return res.status(400).json({ message: 'Invalid message format.' });
    }
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: TOGETHER_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Together AI error:', data);
      return res.status(502).json({ message: data?.error?.message ?? 'AI request failed.' });
    }

    const message = data?.choices?.[0]?.message;
    const reply = message?.content?.trim() || message?.reasoning?.trim() || null;

    if (!reply) {
      return res.status(502).json({ message: 'Empty response from AI service.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat proxy error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ALLOWED_FIELDS = ['first_name', 'last_name', 'email_address', 'phone_number'];

app.post('/api/update-profile', async (req, res) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization || '';
    const match = String(auth).match(/^Bearer\s+(.*)$/i);
    if (!match) return res.status(401).json({ message: 'Missing or invalid authorization header.' });

    const accessToken = match[1];

    // Verify token and get user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return res.status(401).json({ message: 'Invalid session or token.' });
    }

    const user = userData.user;
    if (!user.email) {
      return res.status(400).json({ message: 'Authenticated user has no email.' });
    }

    // Validate body contains only allowed fields
    const body = req.body || {};
    const bodyKeys = Object.keys(body);
    const extra = bodyKeys.filter(k => !ALLOWED_FIELDS.includes(k));
    if (extra.length > 0) {
      return res.status(400).json({ message: `Unexpected fields: ${extra.join(', ')}` });
    }

    // Pick allowed fields and basic type validation
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

    // Find registration record by email
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

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Profile update API listening on http://localhost:${port}`));
