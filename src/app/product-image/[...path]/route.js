export async function GET(request, { params }) {
  const { path } = await params
  const target = Buffer.from(path.join('/'), 'base64url').toString('utf-8')

  const upstream = await fetch(target)

  if (!upstream.ok) {
    return new Response('Image not found', { status: 404 })
  }

  const contentType = upstream.headers.get('content-type') || 'image/jpeg'
  const body = await upstream.arrayBuffer()

  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
