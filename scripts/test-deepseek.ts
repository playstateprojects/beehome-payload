import 'dotenv/config'

const apiKey = process.env.DEEPSEEK_API_KEY
if (!apiKey) {
  console.error('DEEPSEEK_API_KEY not set')
  process.exit(1)
}

const model = process.argv[2] || 'deepseek-v4-flash'
console.log(`Testing model: ${model}`)

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000)

try {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Return a strict JSON object.' },
        { role: 'user', content: JSON.stringify({ task: 'localize', from: 'de', to: 'en', source: { title: 'Hallo Welt' } }) },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
      max_tokens: 256,
    }),
    signal: controller.signal,
  })

  clearTimeout(timeout)
  const json = await res.json() as any
  if (!res.ok) {
    console.error('API error:', res.status, JSON.stringify(json))
    process.exit(1)
  }
  console.log('Success! Response:', json?.choices?.[0]?.message?.content)
} catch (err) {
  clearTimeout(timeout)
  console.error('Failed:', err)
  process.exit(1)
}
