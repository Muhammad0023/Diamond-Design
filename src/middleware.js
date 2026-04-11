import { NextResponse } from 'next/server'

export function middleware(request) {
  const host = request.headers.get('host')
  
  if (host === 'diamonddesignstore.com') {
    return NextResponse.redirect(
      `https://www.diamonddesignstore.com${request.nextUrl.pathname}`,
      301
    )
  }
  
  return NextResponse.next()
}