/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // ミドルウェアを使用するためコメントアウト
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
