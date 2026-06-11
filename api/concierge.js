// Eden - AI Beauty Concierge (secure server-side proxy)
// Keeps the API key off the browser. Gracefully degrades if no key is set.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const KEY = process.env.ANTHROPIC_API_KEY

  // No API key configured - return a friendly fallback so the UI never breaks
  if (!KEY) {
    return res.status(200).json({
      content: [{
        type: 'text',
        text: 'Our AI advisor is taking a quick break - but the top-rated venues for your search are right below. Tap any card to see services, prices and reviews, or use Compare to view up to three side by side.',
      }],
    })
  }

  try {
    const body = req.body || {}

    // Server controls the model and token limits regardless of what the client sends
    const payload = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: body.system || 'You are a friendly UK beauty concierge. Reply in 2-3 warm, specific sentences.',
      messages: Array.isArray(body.messages) ? body.messages.slice(0, 4) : [],
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(200).json({
        content: [{ type: 'text', text: 'I could not find a perfect match just now - try rephrasing, or browse the top-rated venues below.' }],
      })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(200).json({
      content: [{ type: 'text', text: 'Something went wrong on my end - the venues below are sorted by rating, so the best matches are at the top.' }],
    })
  }
}
