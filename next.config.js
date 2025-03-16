/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static HTML export
    images: {
        // Required for static export
        unoptimized: true,
    },
}

module.exports = nextConfig 