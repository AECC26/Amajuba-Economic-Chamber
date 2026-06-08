export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ message: 'Method not allowed.' }),
    };
  }

  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
  const TOGETHER_MODEL = process.env.TOGETHER_MODEL || 'openai/gpt-oss-20b';

  if (!TOGETHER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'AI service is not configured.' }),
    };
  }

  const payload = JSON.parse(event.body || '{}');
  const { messages } = payload;

  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request payload.' }),
    };
  }

  try {
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
      return {
        statusCode: 502,
        body: JSON.stringify({ message: data?.error?.message || 'Together AI request failed.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unable to reach the AI service.' }),
    };
  }
};
