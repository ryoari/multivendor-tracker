/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable transpilePackages for packages that don't provide ESM
  transpilePackages: ['react-leaflet', 'leaflet'],
  
  // Configure webpack to handle Leaflet images
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;