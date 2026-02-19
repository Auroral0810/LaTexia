/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@latexia/ui"],
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // 避免 /favicon.ico 请求返回 404，统一用 logo
    async rewrites() {
        return [
            { source: '/favicon.ico', destination: '/images/logo1.png' },
        ];
    },
};

export default nextConfig;
