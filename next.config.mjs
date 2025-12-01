import path from 'path';
import { fileURLToPath } from 'url';
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === 'development';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/9.x/notionists/**',
      },
    ],
    loader: 'default',
    domains: [],
  },

  webpack(config) {
    config.resolve.alias['@root'] = path.resolve(__dirname);
    return config;
  },
};

export default withPWA({
  dest: "public",
  disable: isDev,
})(nextConfig);
