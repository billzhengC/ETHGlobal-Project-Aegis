/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    // config.resolve.mainFields = ["browser", "main", "module"];
    return config;
  },
};

module.exports = nextConfig;
