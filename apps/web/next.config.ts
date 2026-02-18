/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启严格模式
  reactStrictMode: true,

  // Monorepo 转译
  transpilePackages: ['@latexia/ui', '@latexia/types', '@latexia/validators'],

  // 图片域名白名单
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
