import path from 'path';
import { fileURLToPath } from 'url';

/** Resolve __dirname in ES module scope */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/9.x/notionists/**',
      },
    ],
    // Allow loading local images via "file://" style
    loader: 'default',
    domains: [], // leave empty for local images
  },
  // Alias so you can import images relative to project root
  webpack(config) {
    config.resolve.alias['@root'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
