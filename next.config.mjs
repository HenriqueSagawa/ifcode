/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [
            "api.microlink.io",
            "assets.aceternity.com",
            "images.unsplash.com",
            "media.gettyimages.com"
        ]
    }
};

export default nextConfig;
