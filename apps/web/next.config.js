// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { hostname: 'github.com' },
//       { hostname: 'avatars.githubusercontent.com' },
//     ],
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

module.exports = nextConfig
