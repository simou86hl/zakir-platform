/** @type {import('next').NextConfig} */
const nextConfig = {
  // في production أزل هذه الـ flags - نحتاجها مؤقتاً فقط
  eslint: {
    ignoreDuringBuilds: true, // سيتم تصحيحه لاحقاً
  },
  typescript: {
    ignoreBuildErrors: true, // سيتم تصحيحه لاحقاً
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
};

module.exports = nextConfig;
