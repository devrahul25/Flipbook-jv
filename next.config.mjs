/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any other Next.js options you want here
  // e.g. images, experimental, etc.

  webpack: (config) => {
    // Make sure resolve exists
    config.resolve = config.resolve || {};

    // Preserve existing aliases and add canvas: false
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false, // 👈 Tell webpack to ignore the 'canvas' module
    };

    return config;
  },
};

export default nextConfig;
