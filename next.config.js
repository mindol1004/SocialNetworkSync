/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
    FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
    FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
  },
}

module.exports = nextConfig