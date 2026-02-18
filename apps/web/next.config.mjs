/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@latexia/ui"],
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
