// ai_providers.js

const SYSTEM_PROMPT = `You are a Senior Data Engineering Manager. You are having a 1-on-1 meeting with a Data Engineer.
Your goal is to help them practice their professional English speaking skills.
Keep your responses conversational, very concise (1-3 sentences maximum), and professional.
Ask brief follow-up questions to keep the conversation going.
Do not use markdown formatting like **bold** or *italics* because your text will be read aloud by a text-to-speech engine.`;

export const chatWithAI = async (provider, model, conversationHistory, apiKey) => {
  if (!apiKey) {
    throw new Error(`No API key provided for ${provider}.`);
  }

  if (provider === 'gemini') {
    return await fetchGemini(model, conversationHistory, apiKey);
  } else if (provider === 'groq' || provider === 'openai') {
    return await fetchOpenAICompatible(provider, model, conversationHistory, apiKey);
  } else {
    throw new Error('Unknown AI provider selected.');
  }
};

const fetchGemini = async (model, conversationHistory, apiKey) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = conversationHistory.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 150,
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to connect to Gemini');
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!replyText) throw new Error('Empty response from Gemini');
  return replyText;
};

const fetchOpenAICompatible = async (provider, model, conversationHistory, apiKey) => {
  let endpoint = '';
  if (provider === 'groq') {
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  } else if (provider === 'openai') {
    endpoint = 'https://api.openai.com/v1/chat/completions';
  }

  // Format messages
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  conversationHistory.forEach(msg => {
    messages.push({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    });
  });

  const payload = {
    model: model,
    messages: messages,
    temperature: 0.7,
    max_tokens: 150
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Failed to connect to ${provider}`);
  }

  const data = await response.json();
  const replyText = data.choices?.[0]?.message?.content;

  if (!replyText) throw new Error(`Empty response from ${provider}`);
  return replyText;
};
