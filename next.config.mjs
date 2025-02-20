/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [
            "api.microlink.io",
            "i.imgur.com",
            "drive.google.com"
        ]
    }
};

export default nextConfig;
