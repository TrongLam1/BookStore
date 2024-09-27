// const nextConfig = {
//     reactStrictMode: true,
//     eslint: {
//         ignoreDuringBuilds: true,
//     },
//     images: {
//         remotePatterns: "res.cloudinary.com",
//     },
// };

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            },
        ]
    }
}

module.exports = nextConfig;