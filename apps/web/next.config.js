/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.firebasestorage.googleapis.com' },
    ],
  },
  transpilePackages: ['@neighbourhub/shared'],
};

module.exports = nextConfig;
