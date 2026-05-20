/** @type {import('next').NextConfig} */
const nextConfig = {
  // في production أزل هذه الـ flags - نحتاجها مؤقتاً فقط
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

};

module.exports = nextConfig;
