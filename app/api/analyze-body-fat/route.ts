import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    if (!file) {
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return Response.json({ error: 'Unsupported image type' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64,
              },
            },
            {
              type: 'text',
              text: 'Estimate the body fat percentage of the person in this image. Look at visible muscle definition, vascularity, skin folds, and overall body composition. Reply with ONLY a single number representing your best estimate (e.g. "18"). Do not include the % sign or any other text. If you cannot see a person or cannot make a reasonable estimate, reply with "UNABLE".',
            },
          ],
        },
      ],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    if (raw === 'UNABLE') {
      return Response.json({ error: 'Could not estimate body fat from this image' }, { status: 422 })
    }

    const pct = parseFloat(raw)
    if (isNaN(pct) || pct < 1 || pct > 70) {
      return Response.json({ error: 'Could not produce a valid estimate' }, { status: 422 })
    }

    return Response.json({ percentage: Math.round(pct * 10) / 10 })
  } catch (err) {
    console.error('Body fat analysis error:', err)
    return Response.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
