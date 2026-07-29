/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/collections/wedding-dresses",
        destination: "/collections/habesha-wedding-dresses",
        permanent: true,
      },
      {
        source: "/collections/simple-dresses",
        destination: "/collections/habesha-kemis-simple",
        permanent: true,
      },
      {
        source: "/collections/couples-collection",
        destination: "/collections/matching-habesha-couples",
        permanent: true,
      },
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
}

export default nextConfig