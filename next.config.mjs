/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 80, 90, 100],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
