/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // During production build, Next.js will fail the build if there are type errors.
    // Set this to true if you want to ignore type errors during build.
    ignoreBuildErrors: false,
  },
  eslint: {
    // During production build, Next.js will fail the build if there are eslint errors.
    // Set this to true if you want to ignore eslint errors during build.
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig