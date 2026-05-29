/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'wtxxavngcnyyfxjoxxce.supabase.co', // Default Supabase for testing if any
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // allow all hostnames for now, since it's an e-commerce dashboard with arbitrary URLs
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;

// Trigger Restart
