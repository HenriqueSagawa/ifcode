/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [
            "api.microlink.io",
        ]
    }
};

export default nextConfig;
