// Only images from this project's own Firebase Storage bucket may be proxied
const ALLOWED_HOST = 'firebasestorage.googleapis.com'
const ALLOWED_PATH_PREFIX = '/v0/b/diamond-design-49de2.firebasestorage.app/o/'

export async function GET(request, { params }) {
  const { path } = await params

  // The first segment is the encoded image URL; anything after it is just a readable file name
  let target
  try {
    target = new URL(Buffer.from(path[0], 'base64url').toString('utf-8'))
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  if (
    target.protocol !== 'https:' ||
    target.hostname !== ALLOWED_HOST ||
    !target.pathname.startsWith(ALLOWED_PATH_PREFIX)
  ) {
    return new Response('Forbidden', { status: 403 })
  }

  const upstream = await fetch(target.toString())

  if (!upstream.ok) {
    return new Response('Image not found', { status: 404 })
  }

  const contentType = upstream.headers.get('content-type') || 'image/jpeg'
  const body = await upstream.arrayBuffer()

  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    },
  })
}
